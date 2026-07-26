# LeadDeskPro (LeadDisk-mini)

LeadDeskPro is a full-stack CRM application for managing project enquiries from initial submission to lead follow-up and closure.

The system allows users to submit project requirements, receive a unique tracking ID, and track their enquiry. Administrators can securely log in, view leads, analyze lead information, update statuses, add internal notes, and view the complete activity history of each lead.

---

## 1. Project Architecture

The application follows a client-server architecture:

```text
                         ┌──────────────────────┐
                         │       End User       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │      (Vercel)        │
                         └──────────┬───────────┘
                                    │
                             HTTP / REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Express Backend     │
                         │       (Render)       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              Authentication     Lead Logic      Activities
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      MongoDB          │
                         │    (MongoDB Atlas)    │
                         └──────────────────────┘
```

## 2. Technology Stack
# Frontend

React
Vite
React Router
Axios
JavaScript
CSS

# Backend

Node.js
Express.js
REST API
Mongoose

# Database

MongoDB
MongoDB Atlas
# Authentication and Security

JSON Web Tokens (JWT)
bcryptjs
Environment variables
Protected API routes

# Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

## 3. Project Structure

leaddesk-mini/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── leadController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── Lead.js
│   │   │   └── Activity.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── leadRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── leadScoringService.js
│   │   │   └── projectBriefService.js
│   │   │
│   │   ├── utils/
│   │   │   └── generateTrackingId.js
│   │   │
│   │   └── server.js
│   │
│   ├── createAdmin.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   └── LeadForm.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── TrackLead.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── LeadDetails.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env
│
└── README.md

## 4. Application Flow

# 4.1 User Lead Submission Flow

User
 │
 ▼
Opens LeadDesk Website
 │
 ▼
Fills Project Enquiry Form
 │
 ▼
Submits Form
 │
 ▼
React Frontend
 │
 │ POST /api/leads
 ▼
Express Backend
 │
 ▼
Lead Controller
 │
 ├── Validates submitted data
 │
 ├── Generates unique Tracking ID
 │
 ├── Calculates Lead Score
 │
 ├── Determines Lead Priority
 │
 ├── Generates Project Brief
 │
 ├── Creates Lead Document
 │
 └── Creates Activity Record
 │
 ▼
MongoDB
 │
 ▼
Response Returned to Frontend
 │
 ▼
User Receives Tracking ID

# 5. Lead Tracking Flow

User
 │
 ▼
Enters Tracking ID
 │
 ▼
Frontend
 │
 │ GET /api/leads/track/:trackingId
 ▼
Backend
 │
 ▼
Searches Lead by Tracking ID
 │
 ▼
Returns Lead Status and Information
 │
 ▼
Frontend Displays Lead Details


The tracking functionality is public and does not require administrator authentication.

# 6. Admin Authentication Flow

Administrator
 │
 ▼
Opens Admin Login
 │
 ▼
Submits Email and Password
 │
 ▼
Frontend
 │
 │ POST /api/auth/login
 ▼
Backend
 │
 ▼
Finds Admin Account
 │
 ▼
Compares Password
 │
 │ bcryptjs
 ▼
Credentials Valid?
 │
 ├── No
 │    │
 │    ▼
 │  Login Failed
 │
 └── Yes
      │
      ▼
   JWT Token Generated
      │
      ▼
   Token Sent to Frontend
      │
      ▼
   Token Stored for Session
      │
      ▼
   Admin Dashboard Access Granted

# 7. Authentication Approach

LeadDesk uses JWT-based authentication for administrator functionality.

Login Process
The administrator submits login credentials.
The backend searches for the administrator account.
The submitted password is compared with the stored hashed password using bcryptjs.
If the credentials are valid, the backend generates a JWT.
The frontend stores the authentication token.
The token is attached to future protected API requests.

Protected requests use:Authorization: Bearer <JWT_TOKEN>

The backend authentication middleware verifies the JWT before allowing access to protected routes.

# 8. Admin System

The administrator dashboard provides access to CRM management functionality.

Admin Capabilities

The administrator can:

- View all leads
- View lead statistics
- View individual lead details
- View lead activity history
- Update lead status
- Add internal notes
- View lead score
- View lead priority
- View project information
- View AI-generated project brief

# 9. Protected Admin Routes

The following operations require valid administrator authentication:

GET    /api/leads
GET    /api/leads/:id
GET    /api/leads/:id/activity
POST   /api/leads/:id/notes
PATCH  /api/leads/:id/status

Authentication is handled by:

authMiddleware.js

The middleware:

Request
   │
   ▼
Extract JWT from Authorization Header
   │
   ▼
Verify JWT
   │
   ├── Invalid → Reject Request
   │
   └── Valid → Continue to Controller


# 10. Public Routes
The following routes are publicly accessible:

POST /api/leads
Used to submit a new project enquiry.

GET /api/leads/track/:trackingId
Used by users to track their submitted enquiry.

POST /api/auth/login
Used by administrators to authenticate.

# 11. Data Model

The application uses three main MongoDB models:

Admin
   │
   └── Authenticates Administrator

Lead
   │
   ├── Stores Customer Enquiry
   ├── Stores Project Information
   ├── Stores Lead Score
   ├── Stores Status
   └── Stores Admin Notes

Activity
   │
   └── Stores Lead History

# 12. Lead Model

The Lead model represents a customer project enquiry.

The lead contains information such as:

Lead
│
├── Customer Information
│   ├── Name
│   └── Email
│
├── Project Information
│   ├── Project Type
│   ├── Budget Range
│   ├── Timeline
│   └── Message
│
├── CRM Information
│   ├── Tracking ID
│   ├── Status
│   ├── Priority
│   └── Lead Score
│
├── AI Information
│   └── Project Brief
│
├── Administration
│   └── Admin Notes
│
└── Timestamps
    ├── Created At
    └── Updated At


Lead Status Workflow
┌───────┐
│  New  │
└───┬───┘
    │
    ▼
┌───────────┐
│ Contacted │
└─────┬─────┘
      │
      ▼
┌────────┐
│ Closed │
└────────┘

# 13. Admin Model

The Admin model stores administrator authentication information:

```text
Admin
│
├── Name
├── Email
└── Hashed Password
```
Passwords are never stored as plain text. They are hashed using bcryptjs before being stored in the database.

# 14. Activity Model

The Activity model records important actions related to a lead, such as:

Lead creation
Status updates
Admin notes

This creates an activity timeline for each lead.

Lead
 │
 ├── Activity 1
 ├── Activity 2
 └── Activity 3

# 15. Lead Management Flow

Admin
 │
 ▼
Opens Lead Details
 │
 ├── Views Project Information
 ├── Views Lead Score and Priority
 ├── Views Project Brief
 ├── Updates Lead Status
 └── Adds Internal Notes
        │
        ▼
Backend verifies JWT
        │
        ▼
Lead and Activity records are updated
        │
        ▼
Updated information is displayed

Lead status follows the workflow:

New → Contacted → Closed

Admin notes are internal CRM information and are not visible through the public tracking flow.

# 16. Lead Scoring and Project Brief

The lead scoring service evaluates project information such as project type, budget, and timeline to calculate a lead score and priority.

The project brief service generates structured information including:

Project Brief
│
├── Summary
├── Estimated Complexity
└── Recommended Services

This helps administrators quickly understand and prioritize project enquiries.

# 17. Security and Environment Variables

Sensitive credentials are stored using environment variables and are excluded from Git version control.

The application uses environment variables for:

PORT
MONGO_URI
JWT_SECRET
CLIENT_URL

Actual credentials are never committed to GitHub.

# 18. Deployment Architecture
Users
  │
  ▼
Vercel
(React Frontend)
  │
  ▼
Render
(Node.js + Express API)
  │
  ▼
MongoDB Atlas
(Database)

The frontend communicates with the backend through HTTPS REST API requests.

# 19. Complete System Flow
USER
 │
 ▼
Submit Project Enquiry
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├── Validate Data
 ├── Generate Tracking ID
 ├── Calculate Lead Score
 ├── Generate Project Brief
 └── Save Lead
        │
        ▼
    MongoDB
        │
        ▼
User Receives Tracking ID


ADMIN
 │
 ▼
Admin Login
 │
 ▼
JWT Authentication
 │
 ▼
Admin Dashboard
 │
 ├── View Leads
 ├── View Lead Details
 ├── Update Status
 ├── Add Internal Notes
 └── View Activity Timeline
# 20. Summary

LeadDesk CRM is a full-stack lead management application built with React, Node.js, Express, and MongoDB.

It provides:

Project enquiry submission
Unique lead tracking IDs
Lead scoring and prioritization
Project brief generation
Secure admin authentication
Lead status management
Internal admin notes
Activity history

The application is deployed using Vercel for the frontend, Render for the backend, and MongoDB Atlas for database storage.












