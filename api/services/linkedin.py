"""LinkedIn OAuth 2.0 + Posting Service."""
import os
import json
import secrets
import urllib.parse
import httpx
from datetime import datetime

LINKEDIN_CLIENT_ID = os.environ.get("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.environ.get("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_REDIRECT_URI = "https://mk5188.duckdns.org/rezzobot-api/api/linkedin/callback"
TOKEN_FILE = "/data/linkedin_token.json"
STATE_FILE = "/data/linkedin_state.json"

SCOPES = ["w_member_social", "openid", "profile", "email"]


def get_auth_url():
    """Generate LinkedIn OAuth authorization URL (standard auth code flow)."""
    state = secrets.token_hex(16)

    # Store state for callback verification
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({
            "state": state,
            "created_at": datetime.now().isoformat(),
        }, f)

    params = {
        "response_type": "code",
        "client_id": LINKEDIN_CLIENT_ID,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "state": state,
        "scope": "w_member_social openid profile email",
    }
    return f"https://www.linkedin.com/oauth/v2/authorization?{urllib.parse.urlencode(params)}"


async def exchange_code(code: str, state: str) -> dict:
    """Exchange authorization code for access token."""
    # Verify state
    if not os.path.exists(STATE_FILE):
        return {"error": "No saved state found. Start auth again."}
    with open(STATE_FILE) as f:
        saved = json.load(f)
    if saved.get("state") != state:
        return {"error": "State mismatch. Possible CSRF attack."}

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": LINKEDIN_REDIRECT_URI,
                "client_id": LINKEDIN_CLIENT_ID,
                "client_secret": LINKEDIN_CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=15,
        )
        data = resp.json()

    if "access_token" in data:
        os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
        data["created_at"] = datetime.now().isoformat()
        with open(TOKEN_FILE, "w") as f:
            json.dump(data, f, indent=2)
        os.remove(STATE_FILE)

        user_info = await get_user_info(data["access_token"])
        data["user"] = user_info
        return data

    return {"error": data.get("error_description", data.get("error", "Unknown error"))}


async def get_user_info(access_token: str) -> dict:
    """Fetch authenticated user's LinkedIn profile info."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        if resp.status_code == 200:
            return resp.json()
        return {"error": f"Failed: {resp.status_code}"}


def get_stored_token() -> dict | None:
    """Read stored access token from disk."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE) as f:
            return json.load(f)
    return None


async def create_post(text: str) -> dict:
    """Create a text post on LinkedIn using stored token."""
    token_data = get_stored_token()
    if not token_data:
        return {"error": "Not authenticated. Run /api/linkedin/auth first."}

    access_token = token_data.get("access_token")
    if not access_token:
        return {"error": "No access token found."}

    sub = token_data.get("sub")
    if not sub:
        return {"error": "Could not get user ID. Re-authenticate via /api/linkedin/auth."}

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.linkedin.com/rest/posts",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
                "LinkedIn-Version": "202511",
            },
            json={
                "author": f"urn:li:person:{sub}",
                "commentary": text,
                "visibility": "PUBLIC",
                "distribution": {
                    "feedDistribution": "MAIN_FEED",
                    "targetEntities": [],
                    "thirdPartyDistributionChannels": [],
                },
                "lifecycleState": "PUBLISHED",
                "isReshareDisabledByAuthor": False,
            },
            timeout=15,
        )
        data = resp.json() if resp.text else {}
        if resp.status_code in (200, 201):
            post_id = resp.headers.get("x-restli-id", "unknown")
            return {
                "ok": True,
                "post_id": post_id,
                "url": f"https://www.linkedin.com/feed/update/{post_id}",
            }
        return {
            "error": f"LinkedIn API error ({resp.status_code})",
            "detail": data,
        }


async def check_auth_status() -> dict:
    """Check if we have a valid LinkedIn token."""
    token_data = get_stored_token()
    if not token_data:
        return {"authenticated": False}

    access_token = token_data.get("access_token", "")
    user_info = await get_user_info(access_token)

    if user_info.get("sub"):
        return {
            "authenticated": True,
            "user": user_info.get("name", user_info.get("sub")),
            "expires_at": token_data.get("expires_at", "unknown"),
        }
    return {"authenticated": False, "error": "Token expired or invalid"}
