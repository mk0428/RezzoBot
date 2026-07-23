"""Stripe Checkout — payment endpoint for RezzoBot."""
import os
import stripe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["payment"])

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")

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
        return CheckoutResponse(url=session.url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
