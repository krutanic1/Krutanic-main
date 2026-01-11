from .models import NormalizedJob
from typing import Optional
import pandas as pd

def normalize_job_data(
    row: pd.Series,
    company_filter: Optional[str] = None,
    experience_filter: Optional[str] = None,
    remote_filter: Optional[str] = None
) -> Optional[NormalizedJob]:
    """
    Convert JobSpy DataFrame row to NormalizedJob model
    Apply filters if specified
    
    Args:
        row: pandas Series from JobSpy scraping
        company_filter: Filter by company name (case-insensitive)
        experience_filter: Filter by experience level (entry/mid/senior)
        remote_filter: Filter by remote status (remote/hybrid/onsite)
    
    Returns:
        NormalizedJob object or None if filtered out
    """
    
    try:
        # Extract and clean basic fields
        company = str(row.get('company', 'Unknown')).strip()
        job_title = str(row.get('title', 'Unknown')).strip()
        
        # Handle missing values for optional fields
        location = str(row.get('location', '')).strip() if pd.notna(row.get('location')) else None
        description = str(row.get('description', '')).strip() if pd.notna(row.get('description')) else None
        job_url = str(row.get('job_url', '')).strip() if pd.notna(row.get('job_url')) else ''
        
        # Skip if essential fields are missing
        if company == 'Unknown' or job_title == 'Unknown' or not job_url:
            return None
        
        # Apply company filter
        if company_filter and company_filter.lower() not in company.lower():
            return None
        
        # Detect remote status from description and location
        remote_status = None
        if description:
            desc_lower = description.lower()
            loc_lower = location.lower() if location else ""
            
            if "remote" in desc_lower or "remote" in loc_lower:
                remote_status = "Remote"
            elif "hybrid" in desc_lower or "hybrid" in loc_lower:
                remote_status = "Hybrid"
            elif "on-site" in desc_lower or "onsite" in desc_lower or "on site" in desc_lower:
                remote_status = "On-site"
            elif location and not any(x in loc_lower for x in ["remote", "hybrid", "anywhere"]):
                remote_status = "On-site"
        
        # Apply remote filter
        if remote_filter and remote_status:
            if remote_filter.lower() not in remote_status.lower():
                return None
        
        # Apply experience filter (heuristic-based)
        if experience_filter and description:
            desc_lower = description.lower()
            title_lower = job_title.lower()
            
            if experience_filter == "entry":
                # Look for entry-level indicators
                if not any(keyword in desc_lower or keyword in title_lower 
                          for keyword in ["entry", "junior", "associate", "0-2 years", "0-1 year", "graduate", "fresher"]):
                    # If senior indicators present, filter out
                    if any(keyword in desc_lower or keyword in title_lower 
                          for keyword in ["senior", "lead", "principal", "staff", "5+ years", "7+ years"]):
                        return None
            
            elif experience_filter == "mid":
                # Look for mid-level indicators
                if any(keyword in desc_lower or keyword in title_lower 
                      for keyword in ["senior", "lead", "principal", "7+ years", "10+ years"]):
                    return None
                if any(keyword in desc_lower or keyword in title_lower 
                      for keyword in ["entry", "junior", "fresher", "graduate"]):
                    return None
            
            elif experience_filter == "senior":
                # Must have senior indicators
                if not any(keyword in desc_lower or keyword in title_lower 
                          for keyword in ["senior", "lead", "principal", "staff", "architect", "5+ years", "7+ years", "expert"]):
                    return None
        
        # Extract employment type
        employment_type = None
        if pd.notna(row.get('job_type')):
            employment_type = str(row.get('job_type')).strip()
        
        # Extract salary
        salary = None
        if pd.notna(row.get('interval')) and pd.notna(row.get('min_amount')):
            min_amt = row.get('min_amount')
            max_amt = row.get('max_amount')
            interval = row.get('interval')
            
            if min_amt and max_amt:
                salary = f"${int(min_amt):,} - ${int(max_amt):,} / {interval}"
            elif min_amt:
                salary = f"${int(min_amt):,}+ / {interval}"
        
        # Extract posted date
        posted_date = None
        if pd.notna(row.get('date_posted')):
            posted_date = str(row.get('date_posted'))
        
        # Create description snippet
        description_snippet = None
        if description:
            # Clean up description
            description = description.replace('\n', ' ').replace('\r', ' ')
            description = ' '.join(description.split())  # Normalize whitespace
            
            if len(description) > 250:
                description_snippet = description[:247] + "..."
            else:
                description_snippet = description
        
        # Build normalized job
        return NormalizedJob(
            job_title=job_title,
            company=company,
            platform=str(row.get('site', 'unknown')).lower(),
            job_url=job_url,
            posted_date=posted_date,
            employment_type=employment_type,
            location=location,
            remote_status=remote_status,
            description_snippet=description_snippet,
            salary=salary
        )
    
    except Exception as e:
        print(f"⚠️ Error normalizing job data: {str(e)}")
        return None
