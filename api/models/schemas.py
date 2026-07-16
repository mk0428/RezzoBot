from pydantic import BaseModel
from typing import Optional, List


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


class OptimizeResponse(BaseModel):
    optimized_resume: Resume
    change_log: List[str]
