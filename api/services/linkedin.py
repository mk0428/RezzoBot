"""LinkedIn OAuth 2.0 + Posting Service."""
import json
import os
import secrets
import hashlib
import base64
import urllib.parse
import httpx
from datetime import datetime

import os

LINKEDIN_CLIENT_ID = os.environ.get("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.environ.get("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_REDIRECT_URI = "https://mk5188.duckdns.org/rezzobot-api/api/linkedin/callback"
TOKEN_FILE = "/data/linkedin_token.json"
STATE_FILE = "/data/linkedin_state.json"

SCOPES = ["w_member_social", "openid", "profile", "email"]


def _generate_pkce():
    """Generate PKCE code_verifier and code_challenge."""
    code_verifier = base64.urlsafe_b64encode(
        secrets.token_bytes(32)
    ).rstrip(b"=").decode()
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b"=").decode()
    return code_verifier, code_challenge


def get_auth_url():
    """Generate LinkedIn OAuth authorization URL."""
    state = secrets.token_hex(16)
    code_verifier, code_challenge = _generate_pkce()

    # Store state + PKCE for callback
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({
            "state": state,
            "code_verifier": code_verifier,
            "created_at": datetime.now().isoformat(),
        }, f)

    params = {
        "response_type": "code",
        "client_id": LINKEDIN_CLIENT_ID,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "state": state,
        "scope": " ".join(SCOPES),
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
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

    code_verifier = saved.get("code_verifier")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "code_verifier": code_verifier,
                "redirect_uri": LINKEDIN_REDIRECT_URI,
                "client_id": LINKEDIN_CLIENT_ID,
                "client_secret": LINKEDIN_CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=15,
        )
        data = resp.json()

    if "access_token" in data:
        # Store token
        os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
        data["created_at"] = datetime.now().isoformat()
        with open(TOKEN_FILE, "w") as f:
            json.dump(data, f, indent=2)
        # Clean up state
        os.remove(STATE_FILE)

        # Also fetch user info
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

    # First get user's LinkedIn URN (sub from userinfo)
    user_info = await get_user_info(access_token)
    sub = user_info.get("sub")
    if not sub:
        return {"error": "Could not get user ID. Re-authenticate."}

    # LinkedIn API v2 - Create a post
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.linkedin.com/rest/posts",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
                "LinkedIn-Version": "202401",
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
            return {
                "ok": True,
                "post_id": resp.headers.get("x-restli-id", "unknown"),
                "url": f"https://www.linkedin.com/feed/update/{resp.headers.get('x-restli-id', '')}",
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
