from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from api.models.schemas import ParseResponse, AnalyzeRequest, AnalyzeResponse, ATSReport, OptimizeRequest, OptimizeResponse, Resume
from api.services.parser import extract_text_from_pdf, extract_text_from_image, extract_jd_from_url
from api.services.analyzer import ats_match
from api.services.optimizer import optimize_resume
from api.services.exporter import export_pdf, export_docx
import logging

router = APIRouter(prefix="/api", tags=["resume"])
logger = logging.getLogger(__name__)


@router.post("/parse", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()

    text = ""
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF or Image.")

    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from file.")

    return ParseResponse(text=text, metadata={"filename": filename})


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest):
    result = ats_match(request.resume_text, request.jd_text)

    try:
        report = ATSReport(
            score=result.get("score", 0),
            matched_keywords=result.get("matched_keywords", []),
            missing_keywords=result.get("missing_keywords", []),
            suggestions=result.get("suggestions", []),
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
