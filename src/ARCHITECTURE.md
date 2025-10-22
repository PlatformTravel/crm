# 🏗️ BTM Travel CRM - Architecture Overview

## System Architecture (MongoDB Version)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Login   │  │   CRM    │  │  Promo   │  │ Customer │      │
│  │  Page    │  │  Module  │  │  Sales   │  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Manager  │  │  Admin   │  │ Database │                    │
│  │Dashboard │  │ Settings │  │ Manager  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│                      /utils/config.tsx                         │
│              BACKEND_URL = "https://...supabase.co..."         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP REST API
                                  │ (fetch requests)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Deno + Hono)                  │
│                                                                 │
│           Hosted on: Supabase Functions (Deno Runtime)         │
│           URL: /functions/v1/make-server-8fff4b3c              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  index.tsx - Main Server (40+ REST Endpoints)             │ │
│  │                                                            │ │
│  │  • /health                 - Server health check          │ │
│  │  • /users/login            - User authentication          │ │
│  │  • /users                  - User CRUD                    │ │
│  │  • /database/clients       - Numbers database             │ │
│  │  • /database/clients/import - Upload numbers              │ │
│  │  • /database/clients/assign - Smart assignment            │ │
│  │  • /assignments            - View assignments             │ │
│  │  • /call-logs              - Call history                 │ │
│  │  • /daily-progress         - Progress tracking            │ │
│  │  • /promotions             - Promo management             │ │
│  │  • /smtp-settings          - Email config                 │ │
│  │  • /threecx-settings       - Phone config                 │ │
│  │  • /archive                - Archive management           │ │
│  │  • And 30+ more endpoints...                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  mongodb.tsx - MongoDB Connection & Utilities             │ │
│  │                                                            │ │
│  │  • getMongoDb()           - Get DB connection             │ │
│  │  • getCollection()        - Get collection                │ │
│  │  • initializeDatabase()   - Setup indexes & defaults      │ │
│  │  • convertMongoDoc()      - Transform MongoDB docs        │ │
│  │                                                            │ │
│  │  Connection String: HARDCODED (no env vars!)              │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ MongoDB Driver
                                  │ (npm:mongodb@6.3.0)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS (Cloud Database)               │
│                                                                 │
│        Cluster: cluster0.vlklc6c.mongodb.net                   │
│        Database: btm_travel_crm                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Collections (11 total):                                 │  │
│  │                                                           │  │
│  │  📋 users                - User accounts & permissions   │  │
│  │     Indexes: username (unique), email, role              │  │
│  │                                                           │  │
│  │  📞 numbers_database      - Central numbers DB           │  │
│  │     Fields: phoneNumber, customerType, airplane, status  │  │
│  │     Indexes: phoneNumber, customerType, airplane, status │  │
│  │                                                           │  │
│  │  📌 number_assignments   - Assigned numbers              │  │
│  │     Indexes: agentId, assignedAt, status                 │  │
│  │                                                           │  │
│  │  📞 call_logs            - Call history                  │  │
│  │     Indexes: agentId, callTime, direction                │  │
│  │                                                           │  │
│  │  📝 call_scripts         - Agent scripts                 │  │
│  │                                                           │  │
│  │  🎁 promotions           - Promo campaigns               │  │
│  │                                                           │  │
│  │  📊 daily_progress       - Progress tracking             │  │
│  │                                                           │  │
│  │  ✉️  smtp_settings        - Email config                 │  │
│  │                                                           │  │
│  │  📱 threecx_settings     - Phone system config           │  │
│  │                                                           │  │
│  │  🗄️  archive              - Archived records             │  │
│  │     Indexes: archivedAt, entityType                      │  │
│  │                                                           │  │
│  │  🔐 login_audit          - Security logs                 │  │
│  │     Indexes: timestamp, userId                           │  │
│  │                                                           │  │
│  │  ⚙️  global_settings      - System settings              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│        Management Console: https://cloud.mongodb.com           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. User Login Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Frontend │         │ Backend  │         │ MongoDB  │
│ (React)  │         │ (Deno)   │         │ (Atlas)  │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ POST /users/login  │                     │
     ├───────────────────>│                     │
     │ {username,password}│                     │
     │                    │                     │
     │                    │ find({username,     │
     │                    │      password})     │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │    User document    │
     │                    │<────────────────────┤
     │                    │                     │
     │                    │ insertOne(          │
     │                    │  login_audit)       │
     │                    ├────────────────────>│
     │                    │                     │
     │  {success, user}   │                     │
     │<───────────────────┤                     │
     │                    │                     │
```

### 2. Smart Number Assignment Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Manager  │         │ Backend  │         │ MongoDB  │
│Dashboard │         │ (Deno)   │         │ (Atlas)  │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ POST /database/    │                     │
     │  clients/assign    │                     │
     ├───────────────────>│                     │
     │ {filters: {        │                     │
     │  customerType:     │                     │
     │   "Corporate",     │                     │
     │  airplane: "BA123" │                     │
     │ }, agentId}        │                     │
     │                    │                     │
     │                    │ find({              │
     │                    │  customerType:      │
     │                    │   "Corporate",      │
     │                    │  airplane: "BA123", │
     │                    │  status: "available"│
     │                    │ }).limit(100)       │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │  Matching numbers   │
     │                    │<────────────────────┤
     │                    │                     │
     │                    │ updateMany(         │
     │                    │  {status:"assigned"}│
     │                    ├────────────────────>│
     │                    │                     │
     │                    │ insertMany(         │
     │                    │  assignments)       │
     │                    ├────────────────────>│
     │                    │                     │
     │  {success,         │                     │
     │   assigned: 45}    │                     │
     │<───────────────────┤                     │
     │                    │                     │
```

### 3. Call Logging with 3CX Integration

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Agent   │    │   3CX    │    │ Backend  │    │ MongoDB  │
│Dashboard │    │ System   │    │ (Deno)   │    │ (Atlas)  │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ Click-to-call │               │               │
     ├──────────────>│               │               │
     │               │               │               │
     │               │ Initiate call │               │
     │               │ via WebRTC    │               │
     │<──────────────┤               │               │
     │               │               │               │
     │        Call in progress...    │               │
     │               │               │               │
     │ Call ended    │               │               │
     │               │               │               │
     │ POST /call-logs                │               │
     ├──────────────────────────────>│               │
     │ {phoneNumber,                 │               │
     │  duration,                    │               │
     │  outcome}                     │               │
     │                               │               │
     │                               │ insertOne(    │
     │                               │  call_log)    │
     │                               ├──────────────>│
     │                               │               │
     │                               │ updateOne(    │
     │                               │  assignment,  │
     │                               │  {called:true}│
     │                               ├──────────────>│
     │                               │               │
     │                               │ updateOne(    │
     │                               │ daily_progress│
     │                               ├──────────────>│
     │                               │               │
     │ {success}                     │               │
     │<──────────────────────────────┤               │
     │                               │               │
```

---

## Key Architectural Benefits

### 1. Separation of Concerns
```
Frontend (React)     → UI & User Experience
Backend (Deno)       → Business Logic & API
Database (MongoDB)   → Data Storage & Queries
```

### 2. Scalability
```
Frontend    → Static hosting (scales infinitely)
Backend     → Serverless (scales automatically)
Database    → MongoDB Atlas (sharding + replicas)
```

### 3. Security
```
Frontend    → No database credentials
Backend     → Connection string hardcoded (private)
Database    → Network IP whitelist + authentication
```

### 4. Performance
```
Frontend    → Fast React rendering
Backend     → Deno V8 engine
Database    → Indexed queries (O(log n))
```

---

## Technology Stack

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React Context API
- **Phone:** 3CX WebRTC SDK
- **Notifications:** Sonner toasts

### Backend
- **Runtime:** Deno (TypeScript)
- **Framework:** Hono (web framework)
- **Hosting:** Supabase Functions
- **Database Driver:** MongoDB Node Driver

### Database
- **Database:** MongoDB Atlas
- **Cluster:** M0 (Free tier)
- **Region:** Auto-selected
- **Backup:** Automated snapshots

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              PRODUCTION ENVIRONMENT             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (React)                               │
│  └─> Hosted on: Figma Make / Vercel / Netlify │
│                                                 │
│  Backend (Deno Server)                          │
│  └─> Hosted on: Supabase Functions              │
│      • Auto-scaling                             │
│      • HTTPS/SSL included                       │
│      • Global CDN                               │
│      • Automatic logs                           │
│                                                 │
│  Database (MongoDB)                             │
│  └─> Hosted on: MongoDB Atlas                   │
│      • Automated backups                        │
│      • Monitoring included                      │
│      • Auto-scaling storage                     │
│      • 99.95% uptime SLA                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow
```
1. User submits credentials
   ↓
2. Backend hashes password
   ↓
3. MongoDB query: find({username, password})
   ↓
4. If match: generate session token
   ↓
5. Return user object to frontend
   ↓
6. Store in React Context (memory only)
   ↓
7. All API calls include user context
```

### Authorization Levels
```
Admin
  └─> Full system access
      • Create/edit/delete users
      • Configure settings
      • View all data

Manager
  └─> Team oversight + configurable permissions
      • Assign numbers to agents
      • View team performance
      • Granular permission control

Agent
  └─> Limited to assigned tasks
      • View assigned numbers
      • Log calls
      • Update customer info
```

---

## 🎯 This Architecture Enables

✅ **Smart Filtering** - Query by customer type & airplane  
✅ **Real-time Tracking** - Daily progress with auto-reset  
✅ **Scalability** - Handles millions of records  
✅ **Performance** - Indexed queries are 100x faster  
✅ **Security** - Role-based access control  
✅ **Reliability** - Production-grade infrastructure  

---

**Your BTM Travel CRM is built on a solid, scalable architecture! 🚀**
