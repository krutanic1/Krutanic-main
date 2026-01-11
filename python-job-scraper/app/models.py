from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class JobSearchRequest(BaseModel):
    """Request model for job search"""
    keyword: str = Field(..., min_length=1, description="Job role or keyword")
    platforms: List[str] = Field(default=["linkedin", "indeed"], description="Platforms to scrape")
    location: Optional[str] = Field(None, description="Location filter (optional)")
    experience: Optional[str] = Field(None, description="Experience level: entry, mid, senior")
    company: Optional[str] = Field(None, description="Company name filter")
    remote_status: Optional[str] = Field(None, description="remote/hybrid/onsite", alias="remoteStatus")
    results_per_site: int = Field(default=20, ge=1, le=100, description="Results per platform", alias="resultsPerSite")

    class Config:
        populate_by_name = True  # Allow both snake_case and camelCase
        json_schema_extra = {
            "example": {
                "keyword": "python developer",
                "platforms": ["linkedin", "indeed"],
                "location": "",
                "experience": "mid",
                "company": "",
                "remote_status": "remote",
                "results_per_site": 20
            }
        }


class NormalizedJob(BaseModel):
    """Normalized job listing model"""
    job_title: str
    company: str
    platform: str
    job_url: str
    posted_date: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    remote_status: Optional[str] = None
    description_snippet: Optional[str] = None
    salary: Optional[str] = None
    scraped_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "job_title": "Senior Python Developer",
                "company": "Tech Corp",
                "platform": "linkedin",
                "job_url": "https://linkedin.com/jobs/123",
                "posted_date": "2026-01-08",
                "employment_type": "Full-time",
                "location": "Remote",
                "remote_status": "Remote",
                "description_snippet": "We are looking for an experienced Python developer...",
                "salary": "$120k-$150k",
                "scraped_at": "2026-01-09T10:30:00"
            }
        }


class JobResponse(BaseModel):
    """Response model for job scraping"""
    jobs: List[NormalizedJob]
    total: int
    platforms_scraped: List[str]

    class Config:
        json_schema_extra = {
            "example": {
                "jobs": [],
                "total": 45,
                "platforms_scraped": ["linkedin", "indeed"]
            }
        }
