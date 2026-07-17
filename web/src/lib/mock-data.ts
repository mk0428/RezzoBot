import { ResumeData, ATSReport } from "../types/resume";

export const MOCK_RESUME: ResumeData = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "123-456-7890",
  summary: "Results-driven Software Engineer with 5 years of experience building scalable web applications.",
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      duration: "2020 - Present",
      description: ["Led a team of 5 developers", "Reduced latency by 40%"]
    }
  ],
  education: [
    {
      school: "University of Tech",
      degree: "BS Computer Science",
      year: "2018"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "PostgreSQL", "AWS"]
};

export const MOCK_ATS_REPORT: ATSReport = {
  score: 72,
  matched_keywords: ["React", "TypeScript", "Node.js", "Next.js", "Software Engineer"],
  missing_keywords: ["GraphQL", "Docker", "Kubernetes", "Redis", "Unit Testing"],
  suggestions: [
    "Add metrics to your summary to showcase impact.",
    "Include more keywords related to cloud infrastructure like Docker and Kubernetes.",
    "Highlight unit testing experience if applicable."
  ],
  match_detail: "Your resume matches well in core technologies but lacks infrastructure and testing depth."
};
