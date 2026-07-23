from pydantic import BaseModel
from typing import Optional, List, Any


class Experience(BaseModel):
    company: str = ""
    title: str = ""
    start_date: str = ""
    end_date: str = ""
    description: List[str] = []


class Education(BaseModel):
    school: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""


class Resume(BaseModel):
    name: str = ""
    phone: str = ""
    email: str = ""
    linkedin: str = ""
    summary: str = ""
    experiences: List[Experience] = []
    education: List[Education] = []
    skills: List[str] = []
    languages: List[str] = []
    raw_text: str = ""


class ParseResponse(BaseModel):
    text: str
    metadata: Optional[dict] = {}


class AnalyzeRequest(BaseModel):
    resume_text: str
    jd_text: str = ""
    mode: str = "match"  # "match" (default, compares against JD) or "structure" (pure resume structure analysis)


class Suggestion(BaseModel):
    section: str = ""
    issue: str = ""
    evidence: str = ""
    suggested_fix: str = ""


class QuickWin(BaseModel):
    change: str = ""
    from_text: str = ""
    to_text: str = ""


class ATSReport(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    suggestions: List[str] = []
    suggestions_structured: List[Suggestion] = []
    quick_wins: List[QuickWin] = []
    match_detail: str


class AnalyzeResponse(BaseModel):
    report: ATSReport


class ATSMatchRequest(BaseModel):
    resume: Resume
    jd_text: str


class ATSMatchResponse(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    suggestions: List[str]
    match_detail: str


class OptimizeRequest(BaseModel):
    resume: Resume
    jd_text: str
    sections: List[str] = ["summary", "experiences", "skills"]


class SectionSuggestion(BaseModel):
    section: str = ""
    before: str = ""
    after: str = ""
    reason: str = ""
    impact: str = "medium"


class OptimizeResponse(BaseModel):
    optimized_resume: Resume
    change_log: List[str] = []
    section_suggestions: List[SectionSuggestion] = []
    score_improvement: int = 0
