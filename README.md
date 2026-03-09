# Krutanic - Advanced Learning & Career Management Platform

Krutanic is a robust, full-stack ed-tech platform designed to bridge the gap between education and employment. It offers a comprehensive Learning Management System (LMS), advanced career programs, automated lead management for sales teams, and AI-driven career tools.

## 🚀 Core Features

### 🎓 Learning Management System (LMS)
- **Course Catalog**: Management of regular and advanced industrial programs.
- **Interactive Learning**: Video-based sessions with progress tracking (Watched Sessions calculation).
- **Assessments**:
  - **MCQ Exercises**: Randomized question pulls with structured difficulty (Beginner, Intermediate, Advanced).
  - **Mock Interviews**: AI-powered interview simulation using Gemini AI for real-time feedback and scoring.
  - **Practicals**: A 24-week roadmap for advanced programs with submission and approval workflows.
- **Certifications**: Automated certificate generation using Cloudinary for both courses and masterclasses.

### 💼 Career & Placement Support
- **Job Board**: Centralized portal for job listings and applications.
- **ATS Resume Scoring**: AI-driven analysis of PDF resumes to provide a compatibility score and feedback.
- **Resume Builder**: Built-in tool for creating professional resumes.
- **Placement Readiness**: Algorithmic tracking of student eligibility based on course completion and assessment scores.
- **Interviewer Portal**: Dedicated interface for external interviewers to manage scheduled slots and meeting links.

### 🏢 Enterprise & Team Operations
- **Lead Management (CRM)**:
  - **Round-Robin Assignment**: Automated lead distribution to team members with daily capacity limits.
  - **Hierarchy Support**: Multi-level access for Admins, Managers, Leaders, and Specialists.
  - **Leads Book**: Detailed tracking of call outcomes, demo schedules, and follow-ups.
- **Financial Tracking**: Revenue sheets and payment status monitoring (Booked, Half-Paid, Default) for different team segments.
- **Team Dashboards**: Specialized dashboards for Operations, BDA (Business Development), Advanced Teams, and Marketing.

### 🌍 Community & Events
- **Talent Hunt**: MCQ-based competition platform with leaderboards and award systems.
- **Masterclasses**: Registration and certification for specialized expert-led sessions.
- **Refer & Earn**: Built-in referral system to incentivize organic growth.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (for modern UI), Framer Motion (for animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Cloud/External Services**: 
  - **Cloudinary**: Media and document storage (Resumes, Certificates).
  - **Gemini AI**: Powering Mock Interviews and ATS scoring.
  - **Vercel**: Deployment and Serverless Functions.
  - **Nodemailer**: Transactional email service.

### Project Structure
```text
/
├── BACKEND/
│   ├── config/             # Database & global configurations
│   ├── controllers/        # Email and utility logic
│   ├── middleware/         # Auth, Error handling, Cloudinary config
│   ├── models/             # Mongoose schemas (40+ models)
│   ├── routes/             # REST API endpoints (Categorized by feature)
│   ├── services/           # Background services (Payment reminders, etc.)
│   └── server.js           # Express entry point
├── FRONTEND/
│   ├── src/
│   │   ├── Components/     # Reusable UI elements
│   │   ├── Admin/          # Admin-only screens
│   │   ├── User/           # LMS & Student dashboard
│   │   ├── BDA/            # BDA team portal
│   │   ├── AdvTeam/        # Advanced program management
│   │   ├── Interviewer/    # Interviewer portal
│   │   └── App.jsx         # Main routing and navigation
└── vercel.json             # Deployment & Cron configuration
```

---

## 📡 API Endpoints Documentation (Key Categories)

| Category | Endpoint Base | Purpose |
| :--- | :--- | :--- |
| **Auth** | `/api/login`, `/api/admin/login` | JWT-based secure authentication. |
| **Courses** | `/api/courses`, `/api/adv-courses` | CRUD for program structure and modules. |
| **LMS** | `/api/dashboard`, `/api/learning` | User progress, video tracking, and dashboard metrics. |
| **Leads** | `/api/adv-leads`, `/api/adv-teams` | Lead assignment, CRM activity logging, and team stats. |
| **Assessments** | `/api/exercise`, `/api/mock-interview` | MCQ delivery, AI evaluation, and ATS scoring. |
| **Jobs** | `/api/jobs`, `/api/job-applications` | Job management and resident scraper integration. |
| **Community** | `/api/events`, `/api/masterclass` | Event registration and certificate issuance. |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary credentials
- Gemini API Key

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd krutanic-main
   ```

2. **Backend Setup**:
   ```bash
   cd BACKEND
   npm install
   # Create a .env file with the following:
   # MONGO_URI, JWT_SECRET, GEMINI_API_KEY, CLOUDINARY_URL, SMTP_MAIL, etc.
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd FRONTEND
   npm install
   npm run dev
   ```

---

## 📅 Automation & Maintenance
- **Vercel Cron**: Scheduled tasks for:
  - `auto-assign`: Daily lead distribution.
  - `payment-reminders`: Automated notifications for pending fees.
  - `check-demos`: 5-minute alerts for upcoming interviews.

Developed with ❤️ by the Krutanic Dev Team.
