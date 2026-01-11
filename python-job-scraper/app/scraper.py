from jobspy import scrape_jobs
import pandas as pd
from typing import List, Optional
from .models import NormalizedJob
from .normalizer import normalize_job_data
from .db import save_jobs_to_db

# Platform mapping: frontend names -> JobSpy names
PLATFORM_MAPPING = {
    "linkedin": "linkedin",
    "indeed": "indeed",
    "unstop": "zip_recruiter",  # Unstop not directly supported, using zip_recruiter as alternative
    "zip_recruiter": "zip_recruiter",
    "glassdoor": "glassdoor"
}


async def scrape_jobs_from_platforms(
    keyword: str,
    platforms: List[str],
    location: Optional[str] = None,
    experience: Optional[str] = None,
    company: Optional[str] = None,
    remote_status: Optional[str] = None,
    results_per_site: int = 20
) -> List[NormalizedJob]:
    """
    Scrape jobs using JobSpy across multiple platforms
    
    Args:
        keyword: Job search keyword (e.g., "python developer")
        platforms: List of platforms to scrape (linkedin, indeed, unstop)
        location: Optional location filter (empty string = no location filter)
        experience: Optional experience level (entry, mid, senior)
        company: Optional company name filter
        remote_status: Optional remote status filter (remote, hybrid, onsite)
        results_per_site: Number of results per platform
    
    Returns:
        List of normalized job listings
    """
    
    all_jobs = []
    
    # Map frontend platform names to JobSpy names
    jobspy_platforms = []
    for p in platforms:
        mapped = PLATFORM_MAPPING.get(p.lower(), p.lower())
        jobspy_platforms.append(mapped)
    
    print(f"\n🔍 Starting job scrape...")
    print(f"   Keyword: {keyword}")
    print(f"   Platforms: {', '.join(jobspy_platforms)}")
    print(f"   Location: {location if location else 'Any'}")
    print(f"   Results per site: {results_per_site}")
    
    try:
        # JobSpy scrape call
        # Note: location can be None or empty string - JobSpy handles it
        jobs_df = scrape_jobs(
            site_name=jobspy_platforms,
            search_term=keyword,
            location=location if location else "",  # Empty string = no location filter
            results_wanted=results_per_site,
            hours_old=168,  # Jobs from last 7 days (168 hours)
            country_indeed='USA',  # Can be parameterized if needed
            # Additional filters can be added here
        )
        
        if jobs_df is not None and not jobs_df.empty:
            print(f"✅ Scraped {len(jobs_df)} raw jobs from JobSpy")
            
            # Convert DataFrame to list of normalized jobs
            for idx, row in jobs_df.iterrows():
                normalized_job = normalize_job_data(
                    row, 
                    company_filter=company,
                    experience_filter=experience,
                    remote_filter=remote_status
                )
                
                if normalized_job:
                    all_jobs.append(normalized_job)
            
            print(f"✅ Normalized to {len(all_jobs)} jobs after filtering")
            
            # Save to MongoDB
            if all_jobs:
                save_jobs_to_db(all_jobs, keyword)
        else:
            print("⚠️ No jobs found by JobSpy")
    
    except Exception as e:
        print(f"❌ Scraping error: {str(e)}")
        # Re-raise to be handled by FastAPI
        raise Exception(f"JobSpy scraping failed: {str(e)}")
    
    return all_jobs
