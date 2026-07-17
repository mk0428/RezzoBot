from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from api.models.schemas import ParseResponse, AnalyzeRequest, AnalyzeResponse, ATSReport
from api.services.parser import extract_text_from_pdf, extract_text_from_image, extract_jd_from_url
from api.services.analyzer import ats_match
import logging

router = APIRouter(prefix="/api", tags=["resume"])
logger = logging.getLogger(__name__)

@router.post("/parse", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    解析上传的简历文件 (PDF 或图片)
    """
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
    """
    对比简历和 JD 内容
    """
    result = ats_match(request.resume_text, request.jd_text)

    # 转换为 schema 对象
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
    """
    抓取并解析职位链接中的 JD
    """
    text = extract_jd_from_url(url)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from URL.")

    return ParseResponse(text=text, metadata={"url": url})
