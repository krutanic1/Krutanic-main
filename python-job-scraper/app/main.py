from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
from dotenv import load_dotenv

from .scraper import scrape_jobs_from_platforms
from .models import JobSearchRequest, JobResponse, NormalizedJob

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Job Scraper Microservice",
    version="1.0.0",
    description="FastAPI microservice for scraping job listings from LinkedIn, Indeed, and other platforms using JobSpy"
)

# CORS - Allow Node.js backend
NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[NODE_BACKEND_URL, "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key for authentication
API_KEY = os.getenv("API_KEY", "dev-key-123")

# Debug logging
print(f"🔑 Python Service API Key loaded: {API_KEY[:10] if API_KEY else 'NOT SET'}...")
print(f"🌐 Node Backend URL: {NODE_BACKEND_URL}")


def verify_api_key(x_api_key: str = Header(None)):
    """Verify API key from header"""
    print(f"📥 Received API Key: {x_api_key[:10] if x_api_key else 'None'}...")
    print(f"✅ Expected API Key: {API_KEY[:10]}...")
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing API Key")
    return x_api_key


@app.get("/")
def root():
    """Root endpoint - service info"""
    return {
        "service": "Job Scraper Microservice",
        "status": "running",
        "version": "1.0.0",
        "supported_platforms": ["linkedin", "indeed", "unstop"],
        "endpoints": {
            "scrape": "POST /scrape-jobs",
            "health": "GET /health"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "python-job-scraper",
        "version": "1.0.0"
    }


@app.post("/scrape-jobs", response_model=JobResponse, dependencies=[Depends(verify_api_key)])
async def scrape_jobs(request: JobSearchRequest):
    """
    Scrape jobs from multiple platforms
    
    **Authentication**: Requires `X-API-Key` header
    
    **Request Body:**
    - `keyword` (required): Job search keyword (e.g., "python developer")
    - `platforms` (optional): List of platforms to scrape (default: ["linkedin", "indeed"])
    - `location` (optional): Location filter (leave empty for all locations)
    - `experience` (optional): Experience level (entry/mid/senior)
    - `company` (optional): Company name filter
    - `remote_status` (optional): Remote work filter (remote/hybrid/onsite)
    - `results_per_site` (optional): Results per platform (default: 20, max: 100)
    
    **Response:**
    - `jobs`: List of normalized job listings
    - `total`: Total number of jobs found
    - `platforms_scraped`: Platforms that were scraped
    
    **Note:** Scraping may take 30-60 seconds depending on parameters
    """
    try:
        print("\n" + "="*60)
        print("📋 NEW JOB SCRAPE REQUEST")
        print("="*60)
        
        jobs = await scrape_jobs_from_platforms(
            keyword=request.keyword,
            platforms=request.platforms,
            location=request.location,
            experience=request.experience,
            company=request.company,
            remote_status=request.remote_status,
            results_per_site=request.results_per_site
        )
        
        print(f"✅ Returning {len(jobs)} jobs to Node.js backend")
        print("="*60 + "\n")
        
        return JobResponse(
            jobs=jobs,
            total=len(jobs),
            platforms_scraped=request.platforms
        )
    
    except Exception as e:
        print(f"❌ Scraping failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
