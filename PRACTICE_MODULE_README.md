# Practice Module — Setup Guide

## Overview

The Practice Module adds a full-featured `/practice` section to the Krutanic platform with:

- **Practice Paths**: Python, C++, Java, JavaScript, SQL, DSA
- **Nested hierarchy**: Path → Topic → Subtopic → Question
- **MCQ engine** with instant feedback, explanations, keyboard navigation
- **User progress tracking** per path/topic/subtopic
- **Admin dashboard** for full CRUD management
- **Authentication**: JWT-based Email & Password

---

## New Environment Variables

### BACKEND/.env — Add these:

```env
# Practice Module JWT (separate from main JWT_SECRET for isolation)
PRACTICE_JWT_SECRET=your_practice_jwt_secret_here_min_32_chars
```

### FRONTEND/.env — Add these:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Backend
All dependencies (`axios`, `jsonwebtoken`, `bcrypt`, `mongoose`) are already installed.

### Frontend
No extra dependencies are required.

---

## Running the Seed Script

Populates Practice Python with 1 topic, 1 subtopic, and 4 MCQ questions:

```bash
cd BACKEND
node scripts/seedPractice.js
```

Expected output:
```
✅ Connected to MongoDB
🧹 Cleaned up existing seed data
✅ Created path: Practice Python
✅ Created topic: Introduction, Output and Math Operators
✅ Created subtopic: Output / Printing in Python
✅ Created question: Sum and Print - MCQ
✅ Created question: Print Coding Chef
✅ Created question: Identify Correct Syntax
✅ Created question: Print Difference of 10 and 3
🎉 Seed complete!
```

---

## Promoting a User to Admin

Admins are **manually promoted** in MongoDB. After creating an account via the frontend, update their role:

```js
// MongoDB shell or Compass
db.practiceusers.updateOne(
  { email: "admin@example.com" },
  { $set: { practiceRole: "admin" } }
)
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/practice-auth/register` | Register with Email/Password |
| POST | `/api/practice-auth/login` | Login with Email/Password |
| GET | `/api/practice-auth/me` | Get current practice user profile |

### Practice (requires `practiceToken`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/practice` | List all published paths (with totalProblems) |
| GET | `/api/practice/:pathSlug` | Path detail + topics + subtopics |
| GET | `/api/practice/:pathSlug/progress` | User's progress for a path |
| GET | `/api/practice/question/:questionSlug` | Single question detail |
| POST | `/api/practice/question/:questionId/submit` | Submit MCQ answer |
| GET | `/api/practice/:pathSlug/:topicSlug/:subtopicSlug/questions` | Questions in a subtopic |

### Admin (requires `practiceToken` + `practiceRole: "admin"`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/practice-paths` | List/create paths |
| PUT/DELETE | `/api/admin/practice-paths/:id` | Update/delete path |
| GET/POST | `/api/admin/topics` | List/create topics |
| PUT/DELETE | `/api/admin/topics/:id` | Update/delete topic |
| GET/POST | `/api/admin/subtopics` | List/create subtopics |
| PUT/DELETE | `/api/admin/subtopics/:id` | Update/delete subtopic |
| GET/POST | `/api/admin/questions` | List/create questions (with filters) |
| GET/PUT/DELETE | `/api/admin/questions/:id` | Get/update/delete question |
| GET | `/api/admin/practice/stats` | Dashboard stats |

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/practice/login` | Google sign-in page |
| `/practice` | Practice paths grid |
| `/practice/:pathSlug` | Path detail with topics |
| `/practice/:pathSlug/:topicSlug/:subtopicSlug` | Subtopic question list |
| `/practice/:pathSlug/:topicSlug/:subtopicSlug/:questionSlug` | Question page |
| `/admin/practice` | Admin dashboard |
| `/admin/practice/paths/new` | Create practice path |
| `/admin/practice/paths/:id/edit` | Edit practice path |
| `/admin/practice/questions` | Questions list |
| `/admin/practice/questions/new` | Create question |
| `/admin/practice/questions/:id/edit` | Edit question |

---

## New MongoDB Collections

| Collection | Model | Description |
|------------|-------|-------------|
| `practiceusers` | `PracticeUser` | Google OAuth learners |
| `practicepaths` | `PracticePath` | Practice paths |
| `practicetopics` | `PracticeTopic` | Topics inside paths |
| `practicesubtopics` | `PracticeSubtopic` | Subtopics inside topics |
| `practicequestions` | `PracticeQuestion` | MCQ/Coding questions |
| `userquestionprogresses` | `UserQuestionProgress` | Per-user question progress |

---

## Key Design Decisions

- **totalProblems is never stored** — always calculated dynamically via MongoDB aggregation
- **practiceToken** is stored in `localStorage` with key `practiceToken` — separate from all existing auth tokens
- **Once solved, stays solved** — question status cannot downgrade from `solved` to `attempted`
- **Options hidden until submission** — `isCorrect` field on options is only sent after user submits
- **Admin promotion is manual** — set `practiceRole: "admin"` in MongoDB directly
