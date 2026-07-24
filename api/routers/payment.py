"""Stripe Checkout — payment endpoint + webhook for RezzoBot."""
import os
import stripe
import json
import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)
TRACK_LOG = "/data/tracking.jsonl"

router = APIRouter(prefix="/api", tags=["payment"])

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

PRICE_MAP = {
    "single":   "price_1TwHu6PmXBEMPweO524prhOG",   # $4.99 one-time
    "monthly":  "price_1TwHu6PmXBEMPweOgYuZdj1S",   # $14.99/month
    "lifetime": "price_1TwHu6PmXBEMPweOPVzmnGjF",    # $666 one-time
}

MODE_MAP = {
    "single":   "payment",
    "monthly":  "subscription",
    "lifetime": "payment",
}


class CheckoutRequest(BaseModel):
    type: str  # "single" | "monthly" | "lifetime"


class CheckoutResponse(BaseModel):
    url: str


def _write_track(event: str, data: dict):
    """Write a tracking event to the shared tracking log."""
    import json
    import os
    entry = {
        "event": event,
        "ts": __import__("datetime").datetime.now().isoformat(),
        "data": data,
    }
    try:
        os.makedirs(os.path.dirname(TRACK_LOG), exist_ok=True)
        with open(TRACK_LOG, "a") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.warning(f"Track write error: {e}")


@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session(req: CheckoutRequest):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    plan = req.type
    price_id = PRICE_MAP.get(plan)
    if not price_id:
        raise HTTPException(status_code=400, detail=f"Unknown plan: {plan}")

    stripe.api_key = STRIPE_SECRET_KEY

    try:
        session = stripe.checkout.Session.create(
            mode=MODE_MAP.get(plan, "payment"),
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            success_url="https://rezzobot.com/?payment=success&type=" + plan,
            cancel_url="https://rezzobot.com/?payment=cancelled",
            locale="auto",
        )

        # Track: checkout session created
        _write_track("checkout_started", {
            "plan": plan,
            "session_id": session.id,
        })

        return CheckoutResponse(url=session.url)
    except Exception as e:
        _write_track("checkout_error", {"plan": plan, "error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stripe-webhook")
async def stripe_webhook(request: Request):
    """Stripe webhook endpoint — called by Stripe after payment events."""
    if not STRIPE_WEBHOOK_SECRET:
        logger.warning("STRIPE_WEBHOOK_SECRET not set — skipping webhook verification")
        return JSONResponse({"ok": False, "error": "webhook not configured"}, status_code=500)

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        return JSONResponse({"ok": False, "error": "missing stripe-signature header"}, status_code=400)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return JSONResponse({"ok": False, "error": "invalid payload"}, status_code=400)
    except stripe.error.SignatureVerificationError:
        return JSONResponse({"ok": False, "error": "invalid signature"}, status_code=400)

    # Handle checkout.session.completed
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        plan = "unknown"
        # Extract plan from success_url query param or metadata
        success_url = session.get("success_url", "")
        if "type=single" in success_url:
            plan = "single"
        elif "type=monthly" in success_url:
            plan = "monthly"
        elif "type=lifetime" in success_url:
            plan = "lifetime"

        amount = session.get("amount_total", 0)
        currency = session.get("currency", "usd")

        _write_track("payment_completed", {
            "plan": plan,
            "amount_cents": amount,
            "currency": currency,
            "stripe_session_id": session.get("id", ""),
            "payment_status": session.get("payment_status", ""),
        })

        logger.info(f"Payment completed: {plan} — {amount/100:.2f} {currency}")

    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        _write_track("checkout_expired", {
            "stripe_session_id": session.get("id", ""),
        })

    return JSONResponse({"ok": True})
