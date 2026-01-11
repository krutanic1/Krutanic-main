from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("⚠️ WARNING: MONGO_URI not found in environment, using default localhost")
    MONGO_URI = "mongodb://localhost:27017/krutanic"
else:
    print(f"✅ MongoDB URI loaded from environment: {MONGO_URI[:50]}...")

client = MongoClient(MONGO_URI)
db = client["krutanic"]  # Explicitly specify database name
scraped_jobs_collection = db["scrapedjobs"]

# Create indexes
try:
    scraped_jobs_collection.create_index("jobUrl", unique=True)
    scraped_jobs_collection.create_index([("jobTitle", "text"), ("company", "text")])
    scraped_jobs_collection.create_index("scrapedAt")
    print("✅ MongoDB indexes created successfully")
except Exception as e:
    print(f"⚠️ Index creation warning: {str(e)}")

def save_jobs_to_db(jobs_list, search_keyword):
    """
    Save scraped jobs to MongoDB with upsert logic
    """
    saved_count = 0
    updated_count = 0
    
    for job in jobs_list:
        try:
            job_doc = {
                "jobTitle": job.job_title,
                "company": job.company,
                "platform": job.platform,
                "jobUrl": job.job_url,
                "postedDate": job.posted_date,
                "employmentType": job.employment_type,
                "location": job.location,
                "remoteStatus": job.remote_status,
                "descriptionSnippet": job.description_snippet,
                "salary": job.salary,
                "searchKeyword": search_keyword,
                "lastSeenAt": datetime.utcnow(),
                "isActive": True,
                "viewCount": 0,
            }
            
            # Upsert: Update if exists, insert if new
            result = scraped_jobs_collection.update_one(
                {"jobUrl": job.job_url},
                {
                    "$set": job_doc,
                    "$setOnInsert": {"scrapedAt": datetime.utcnow()}
                },
                upsert=True
            )
            
            if result.upserted_id:
                saved_count += 1
            elif result.modified_count > 0:
                updated_count += 1
                
        except Exception as e:
            print(f"❌ Error saving job {job.job_url}: {str(e)}")
            continue
    
    print(f"💾 Database: {saved_count} new jobs, {updated_count} updated")
    return saved_count, updated_count
