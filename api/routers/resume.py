from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import Response, JSONResponse
from api.models.schemas import ParseResponse, AnalyzeRequest, AnalyzeResponse, ATSReport, OptimizeRequest, OptimizeResponse, Resume
from api.services.parser import extract_text_from_pdf, extract_text_from_image, extract_jd_from_url
from api.services.analyzer import ats_match
from api.services.optimizer import optimize_resume
from api.services.exporter import export_pdf, export_docx
import logging
import json
import os
from datetime import datetime, date

router = APIRouter(prefix="/api", tags=["resume"])
logger = logging.getLogger(__name__)

RATE_LIMIT_DIR = "/data/rate_limits"
DAILY_FREE_SCORE = 1


def _get_client_ip(request: Request) -> str:
    """Get real client IP from forwarded headers."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def _check_daily_score_limit(ip: str) -> tuple[bool, str]:
    """Check if this IP has used today's free score allotment.
    Returns (allowed, reason)."""
    today = date.today().isoformat()
    ip_safe = ip.replace(":", "_").replace(".", "_")
    limit_file = os.path.join(RATE_LIMIT_DIR, f"{today}_{ip_safe}.json")

    if not os.path.exists(limit_file):
        # First use today — create file
        os.makedirs(RATE_LIMIT_DIR, exist_ok=True)
        with open(limit_file, "w") as f:
            json.dump({"ip": ip, "date": today, "count": 1}, f)
        return True, "ok"

    try:
        with open(limit_file) as f:
            data = json.load(f)
        count = data.get("count", 0)
        if count >= DAILY_FREE_SCORE:
            return False, "Daily free score limit reached (1 per day)"
        # Increment
        data["count"] = count + 1
        with open(limit_file, "w") as f:
            json.dump(data, f)
        return True, "ok"
    except (json.JSONDecodeError, OSError) as e:
        logger.error(f"Rate limit read error for {ip}: {e}")
        return True, "ok"  # Fail open on errors

TRACK_LOG = "/data/tracking.jsonl"
EXCLUDED_IPS = set(
    ip.strip()
    for ip in os.environ.get("EXCLUDED_IPS", "").split(",")
    if ip.strip()
)
LANG_COUNTRY_MAP = {
    "en": "US", "zh": "CN", "es": "ES", "fr": "FR", "de": "DE",
    "ja": "JP", "ko": "KR", "pt": "BR", "ru": "RU", "ar": "SA",
    "hi": "IN", "it": "IT", "nl": "NL", "pl": "PL", "tr": "TR",
    "vi": "VN", "th": "TH", "sv": "SE", "id": "ID", "ms": "MY",
}


def _parse_device(ua: str) -> str:
    """Determine device type from User-Agent string."""
    u = ua.lower()
    if "ipad" in u or "tablet" in u or "kindle" in u or "silk" in u:
        return "tablet"
    if any(x in u for x in ["mobile", "iphone", "android", "ipod", "blackberry",
                            "opera mini", "windows phone", "iemobile"]):
        return "mobile"
    return "desktop"


def _guess_country(accept_language: str) -> str:
    """Guess likely country from Accept-Language header. Zero-dependency."""
    import re
    # Try en-US → US, zh-CN → CN
    m = re.search(r"([a-z]{2})-([A-Z]{2})", accept_language)
    if m:
        return m.group(2)
    # Fallback: map first language tag
    m = re.search(r"^([a-z]{2})", accept_language)
    if m:
        return LANG_COUNTRY_MAP.get(m.group(1), "unknown")
    return "unknown"


@router.post("/track")
async def track_pageview(request: Request):
    """Event tracking. Accepts page_view, file_selected, file_parsed, file_parse_failed, etc."""
    try:
        body = await request.json()
        ua = request.headers.get("user-agent", "")
        body["ip"] = request.client.host if request.client else "unknown"
        body["user_agent"] = ua
        body["device_type"] = _parse_device(ua)
        body["country"] = _guess_country(
            request.headers.get("accept-language", "")
        )
        os.makedirs(os.path.dirname(TRACK_LOG), exist_ok=True)
        with open(TRACK_LOG, "a") as f:
            f.write(json.dumps(body, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.warning(f"Track error: {e}")
    return JSONResponse({"ok": True})


@router.get("/track/stats")
async def track_stats():
    """Return tracking stats with enriched analytics."""
    stats = {
        "total_events": 0,
        "pages": {},
        "today": 0,
        "referrers": {},
        "events": {},
        "geo": {},
        "device": {},
        "sessions": {"unique": 0, "repeat": 0, "cross_day": 0},
        "hourly": {},
        "file_errors": {},
        "file_sizes": {"total": 0, "count": 0},
    }
    today = datetime.now().strftime("%Y-%m-%d")
    sessions_seen = {}
    events_per_session = {}

    if os.path.exists(TRACK_LOG):
        with open(TRACK_LOG) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    # Skip excluded IPs (e.g. founder/team)
                    if entry.get("ip") in EXCLUDED_IPS:
                        continue
                    stats["total_events"] += 1

                    # Event type breakdown
                    event = entry.get("event", "page_view")
                    stats["events"][event] = stats["events"].get(event, 0) + 1

                    # Page popularity
                    url = entry.get("url", "/")
                    stats["pages"][url] = stats["pages"].get(url, 0) + 1

                    # Today's count
                    ts = entry.get("ts", "")
                    if ts.startswith(today):
                        stats["today"] += 1

                    # Referrer sources
                    ref = entry.get("referrer", "")
                    if ref:
                        stats["referrers"][ref] = stats["referrers"].get(ref, 0) + 1

                    # GEO distribution
                    country = entry.get("country", "unknown")
                    stats["geo"][country] = stats["geo"].get(country, 0) + 1

                    # Device distribution
                    device = entry.get("device_type", "unknown")
                    stats["device"][device] = stats["device"].get(device, 0) + 1

                    # Hourly breakdown
                    if ts:
                        try:
                            hour = ts[11:13]
                            stats["hourly"][hour] = stats["hourly"].get(hour, 0) + 1
                        except IndexError:
                            pass

                    # Session tracking
                    sid = entry.get("session_id", "")
                    if sid:
                        day = ts[:10] if ts else "unknown"
                        if sid not in sessions_seen:
                            sessions_seen[sid] = {"days": set(), "event_count": 0}
                        sessions_seen[sid]["days"].add(day)
                        sessions_seen[sid]["event_count"] += 1
                        if sid not in events_per_session:
                            events_per_session[sid] = 0
                        events_per_session[sid] += 1

                    # File error clustering
                    if event == "file_parse_failed":
                        err = entry.get("data", {}).get("error", "unknown") if isinstance(entry.get("data"), dict) else "unknown"
                        stats["file_errors"][err] = stats["file_errors"].get(err, 0) + 1

                    # File size tracking
                    if event in ("file_parsed", "file_parse_failed", "file_selected"):
                        data = entry.get("data")
                        if isinstance(data, dict) and data.get("size"):
                            stats["file_sizes"]["total"] += int(data["size"])
                            stats["file_sizes"]["count"] += 1

                except json.JSONDecodeError:
                    continue

    # Session analysis
    stats["sessions"]["unique"] = len(sessions_seen)
    for sid, info in sessions_seen.items():
        if len(info["days"]) > 1:
            stats["sessions"]["cross_day"] += 1
        if info["event_count"] > 1:
            stats["sessions"]["repeat"] += 1

    # Average file size
    if stats["file_sizes"]["count"] > 0:
        stats["file_sizes"]["avg_bytes"] = stats["file_sizes"]["total"] // stats["file_sizes"]["count"]
    del stats["file_sizes"]["total"]

    # Sort for readability
    stats["pages"] = dict(sorted(stats["pages"].items(), key=lambda x: -x[1]))
    stats["events"] = dict(sorted(stats["events"].items(), key=lambda x: -x[1]))
    stats["geo"] = dict(sorted(stats["geo"].items(), key=lambda x: -x[1]))
    stats["hourly"] = dict(sorted(stats["hourly"].items()))
    stats["file_errors"] = dict(sorted(stats["file_errors"].items(), key=lambda x: -x[1]))

    return JSONResponse(stats)


SNAPSHOT_DIR = "/data/archive"


@router.post("/track/snapshot")
async def track_snapshot():
    """Save current tracking stats as a weekly snapshot for trend comparison."""
    try:
        # Get current stats
        stats_response = await track_stats()
        stats = json.loads(stats_response.body)

        os.makedirs(SNAPSHOT_DIR, exist_ok=True)
        week_label = datetime.now().strftime("%Y-W%V")
        snapshot_path = f"{SNAPSHOT_DIR}/{week_label}.json"

        stats["snapshot_week"] = week_label
        stats["snapshot_ts"] = datetime.now().isoformat()

        with open(snapshot_path, "w") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)

        return JSONResponse({"ok": True, "week": week_label, "path": snapshot_path})
    except Exception as e:
        logger.error(f"Snapshot error: {e}")
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.get("/track/history")
async def track_history():
    """Return all historical snapshots for trend analysis."""
    snapshots = []
    if os.path.exists(SNAPSHOT_DIR):
        files = sorted(os.listdir(SNAPSHOT_DIR), reverse=True)
        for fname in files[:52]:  # max 52 weeks = 1 year
            if fname.endswith(".json"):
                try:
                    with open(os.path.join(SNAPSHOT_DIR, fname)) as f:
                        snapshots.append(json.load(f))
                except json.JSONDecodeError:
                    continue
    return JSONResponse(snapshots)


@router.get("/report")
async def get_report():
    """Serve the live analytics report HTML page."""
    from fastapi.responses import HTMLResponse
    report_path = "/app/api/static/report.html"
    if os.path.exists(report_path):
        with open(report_path) as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(
        content="<html><body><h1>Report not found</h1></body></html>",
        status_code=404,
    )

@router.post("/parse", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = (file.filename or "unknown").lower()
    file_size = len(content)
    content_type = file.content_type or "unknown"

    # 记录用户上传的文件元数据（用于产品分析）
    logger.info(
        "FILE_UPLOAD|filename=%s|size=%d|type=%s",
        filename, file_size, content_type,
    )

    text = ""
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF or Image.")

    if not text:
        logger.warning(
            "FILE_PARSE_FAILED|filename=%s|size=%d|type=%s",
            filename, file_size, content_type,
        )
        raise HTTPException(status_code=422, detail="Could not extract text from file.")

    logger.info(
        "FILE_PARSE_OK|filename=%s|size=%d|type=%s|text_len=%d",
        filename, file_size, content_type, len(text),
    )

    return ParseResponse(text=text, metadata={"filename": filename})


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest, http_request: Request):
    """Analyze resume with server-side daily rate limit (1 free score per IP per day).
    All modes (match + structure) share the same daily pool: 1 free analysis per IP."""
    # All modes are rate limited — one free analysis per IP per day
    client_ip = _get_client_ip(http_request)
    allowed, reason = _check_daily_score_limit(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=402,
            detail=reason
        )

    result = ats_match(request.resume_text, request.jd_text, mode=request.mode)

    try:
        # Build structured suggestions list
        structured = result.get("suggestions", [])
        suggestions_structured = []
        for s in structured:
            if isinstance(s, dict):
                suggestions_structured.append({
                    "section": s.get("section", ""),
                    "issue": s.get("issue", ""),
                    "evidence": s.get("evidence", ""),
                    "suggested_fix": s.get("suggested_fix", ""),
                })

        # Flat suggestions for backward compatibility
        flat_suggestions = result.get("suggestions_flat", [])
        if not flat_suggestions and structured:
            flat_suggestions = [
                f"[{s.get('section', 'General')}] {s.get('issue', '')} — {s.get('suggested_fix', '')}"
                for s in structured if isinstance(s, dict)
            ]

        quick_wins = result.get("quick_wins", [])

        report = ATSReport(
            score=result.get("score", 0),
            matched_keywords=result.get("matched_keywords", []),
            missing_keywords=result.get("missing_keywords", []),
            suggestions=flat_suggestions or result.get("suggestions", []),
            suggestions_structured=suggestions_structured,
            quick_wins=quick_wins,
            match_detail=result.get("match_detail", "Analysis completed")
        )
        return AnalyzeResponse(report=report)
    except Exception as e:
        logger.error(f"Error structuring analyze response: {e}")
        raise HTTPException(status_code=500, detail="Error generating analysis report")


@router.post("/parse_jd_url", response_model=ParseResponse)
async def parse_jd_url(url: str = Form(...)):
    text = extract_jd_from_url(url)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from URL.")

    return ParseResponse(text=text, metadata={"url": url})


@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_resume_endpoint(request: OptimizeRequest):
    """AI-powered resume optimization for a specific JD."""
    # Use the resume raw_text if available, otherwise serialize the structured resume
    resume_text = request.resume.raw_text or _serialize_resume(request.resume)

    result = optimize_resume(resume_text, request.jd_text)

    # Parse the optimized text back into structured resume
    optimized_resume = _parse_optimized_result(result.get("optimized_text", ""), request.resume)

    return OptimizeResponse(
        optimized_resume=optimized_resume,
        change_log=result.get("change_log", ["Optimization completed"]),
        section_suggestions=result.get("section_suggestions", []),
        score_improvement=result.get("score_improvement", 0),
    )


@router.post("/export/pdf")
async def export_resume_pdf(resume_text: str = Form(...)):
    """Export resume as PDF."""
    pdf_bytes = export_pdf(resume_text)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="PDF generation failed")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=optimized_resume.pdf"},
    )


@router.post("/export/docx")
async def export_resume_docx(resume_text: str = Form(...)):
    """Export resume as DOCX."""
    docx_bytes = export_docx(resume_text)
    if not docx_bytes:
        raise HTTPException(status_code=500, detail="DOCX generation failed")

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=optimized_resume.docx"},
    )


def _serialize_resume(resume: Resume) -> str:
    """Convert structured Resume model to plain text for optimization."""
    parts = [f"Name: {resume.name}"]
    if resume.email:
        parts.append(f"Email: {resume.email}")
    if resume.linkedin:
        parts.append(f"LinkedIn: {resume.linkedin}")
    if resume.summary:
        parts.append(f"\nPROFESSIONAL SUMMARY\n{resume.summary}")

    if resume.experiences:
        parts.append("\nWORK EXPERIENCE")
        for exp in resume.experiences:
            parts.append(f"\n{exp.title} | {exp.company} | {exp.start_date} - {exp.end_date}")
            for desc in exp.description:
                parts.append(f"• {desc}")

    if resume.education:
        parts.append("\nEDUCATION")
        for edu in resume.education:
            parts.append(f"{edu.degree} in {edu.field} | {edu.school} | {edu.start_date} - {edu.end_date}")

    if resume.skills:
        parts.append("\nSKILLS")
        parts.append(", ".join(resume.skills))

    if resume.languages:
        parts.append("\nLANGUAGES")
        parts.append(", ".join(resume.languages))

    return "\n".join(parts)


def _parse_optimized_result(optimized_text: str, original: Resume) -> Resume:
    """Parse the optimized text back into Resume model, preserving original structure."""
    # For MVP, keep the original Resume structure but update raw_text
    return Resume(
        name=original.name,
        email=original.email,
        linkedin=original.linkedin,
        summary=original.summary,
        experiences=original.experiences,
        education=original.education,
        skills=original.skills,
        languages=original.languages,
        raw_text=optimized_text,
    )


# ─── LinkedIn MKBot Routes ────────────────────────────────────────

from fastapi.responses import RedirectResponse, HTMLResponse
from api.services import linkedin


@router.get("/linkedin/auth")
async def linkedin_auth():
    """Step 1: Initiate LinkedIn OAuth. Redirects user to LinkedIn."""
    auth_url = linkedin.get_auth_url()
    return RedirectResponse(url=auth_url)


@router.get("/linkedin/callback")
async def linkedin_callback(code: str = "", state: str = ""):
    """Step 2: LinkedIn redirects here after user authorizes."""
    if not code:
        return HTMLResponse(
            content="<html><body><h2>Authorization cancelled or failed.</h2><p>No code received.</p></body></html>",
            status_code=400,
        )
    result = await linkedin.exchange_code(code, state)

    if "error" in result:
        return HTMLResponse(
            content=f"<html><body><h2>Auth Failed</h2><p>{result['error']}</p></body></html>",
            status_code=400,
        )

    user_name = result.get("user", {}).get("name", "Unknown")
    return HTMLResponse(
        content=f"""
        <html><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0a0f;color:#e4e4ed">
        <div style="text-align:center;padding:40px;background:#1a1a26;border-radius:16px;border:1px solid #2a2a3a">
        <h1 style="color:#3b82f6">✅ MKBot Connected</h1>
        <p>Authenticated as: <strong>{user_name}</strong></p>
        <p style="color:#8888a0;font-size:13px">You can now close this tab. Use /api/linkedin/post to publish.</p>
        </div></body></html>
        """
    )


@router.post("/linkedin/post")
async def linkedin_post(text: str = ""):
    """Post text to LinkedIn. Requires ?text= parameter."""
    if not text:
        return JSONResponse({"error": "Missing 'text' parameter"}, status_code=400)

    result = await linkedin.create_post(text)
    return JSONResponse(result)


@router.get("/mkbot/auth")
async def get_mkbot_auth_page():
    """Serve the MKBot OAuth authorization page."""
    from fastapi.responses import HTMLResponse
    path = "/app/api/static/mkbot-auth.html"
    if os.path.exists(path):
        with open(path) as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("Not found", status_code=404)


@router.get("/linkedin/status")
async def linkedin_status():
    """Check if MKBot is authenticated with LinkedIn."""
    status = await linkedin.check_auth_status()
    return JSONResponse(status)
