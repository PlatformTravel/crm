# 🚀 Deploy BTM Travel CRM - Pure MongoDB (No Supabase!)

## ✅ Complete! All Supabase Dependencies Removed!

Your backend is now in `/backend/` with **ZERO** Supabase dependencies!

---

## 🎯 What's in `/backend/`

```
/backend/
├── server.tsx    ← Main Deno server (40+ REST endpoints)
├── mongodb.tsx   ← MongoDB connection utilities  
└── deno.json     ← Deno configuration
```

**No Supabase!** Just pure Deno + MongoDB!

---

## 🚀 Quick Start - Local Development

### 1. Start the Backend Server

```bash
cd backend
deno run --allow-net --allow-env server.tsx
```

The server will start on **http://localhost:8000**

### 2. Test the Server

```bash
curl http://localhost:8000/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB)",
  "version": "3.0.0-mongodb-standalone"
}
```

### 3. Start the Frontend

The frontend is already configured to use `http://localhost:8000` in `/utils/config.tsx`

Just run your frontend as normal and it will connect to your local backend!

---

## 🌐 Deploy to Production

### Option 1: Deno Deploy (Recommended) ⭐

**Why?** Free, fast, built for Deno, global CDN

**Steps:**
1. Go to https://dash.deno.com
2. Create new project
3. Connect your Git repository
4. Point to `/backend/server.tsx`
5. Deploy!

**Your URL:** `https://your-project.deno.dev`

**Update `/utils/config.tsx`:**
```tsx
export const BACKEND_URL = 'https://your-project.deno.dev';
```

---

### Option 2: Railway

**Why?** Easy deployment, great for teams

**Steps:**
1. Install Railway CLI: `npm install -g railway`
2. Login: `railway login`
3. In `/backend/` directory: `railway init`
4. Deploy: `railway up`

**Your URL:** `https://your-project.railway.app`

**Update `/utils/config.tsx`:**
```tsx
export const BACKEND_URL = 'https://your-project.railway.app';
```

---

###Option 3: Render

**Why?** Free tier, auto-deploys from Git

**Steps:**
1. Go to https://render.com
2. Create new **Web Service**
3. Connect your Git repository
4. **Build Command:** `cd backend && deno cache server.tsx`
5. **Start Command:** `cd backend && deno run --allow-net --allow-env server.tsx`
6. **Environment:** Deno
7. Deploy!

**Your URL:** `https://your-project.onrender.com`

**Update `/utils/config.tsx`:**
```tsx
export const BACKEND_URL = 'https://your-project.onrender.com';
```

---

### Option 4: Fly.io

**Why?** Global deployment, great performance

**Steps:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth login`
3. In `/backend/` directory: `flyctl launch`
4. Follow prompts
5. Deploy: `flyctl deploy`

**Your URL:** `https://your-project.fly.dev`

**Update `/utils/config.tsx`:**
```tsx
export const BACKEND_URL = 'https://your-project.fly.dev';
```

---

## 📋 Post-Deployment Checklist

### 1. Test Health Endpoint ✅
```bash
curl https://your-deployed-url.com/health
```

### 2. Login with Default Admin ✅
- **URL:** Your frontend URL
- **Username:** `admin`
- **Password:** `admin123`

### 3. Change Admin Password ⚠️
1. Login as admin
2. Go to Admin → Settings
3. Change password immediately!

### 4. Configure Settings ✅
- SMTP settings (email)
- 3CX settings (phone system)
- Create users
- Upload numbers

---

## 🗄️ MongoDB Atlas

**Your database:**
- **Cluster:** cluster0.vlklc6c.mongodb.net
- **Database:** btm_travel_crm
- **Console:** https://cloud.mongodb.com

**Connection:** Hardcoded in `/backend/mongodb.tsx` (line 17)

**Collections:**
1. users
2. numbers_database (with customerType & airplane filters!)
3. number_assignments
4. call_logs
5. call_scripts
6. promotions
7. daily_progress
8. smtp_settings
9. threecx_settings
10. archive
11. login_audit

---

## 🎨 Frontend Configuration

**File:** `/utils/config.tsx`

```tsx
// Development (local backend)
export const BACKEND_URL = 'http://localhost:8000';

// Production (after deployment)
export const BACKEND_URL = 'https://your-deployed-url.com';
```

**That's it!** No other changes needed!

---

## 🔥 What's Different from Supabase Version

### ❌ Removed:
- `/supabase/` directory references
- Supabase Functions path handling (`/functions/v1/make-server-8fff4b3c`)
- Supabase environment variables
- Supabase auth headers
- All Supabase dependencies

### ✅ Added:
- `/backend/` directory with clean server code
- Pure Deno server with standard path routing
- Direct MongoDB connection
- Multiple deployment options
- Local development support

---

## 🛠️ Development Workflow

### Local Development:
```bash
# Terminal 1: Start backend
cd backend
deno run --allow-net --allow-env server.tsx

# Terminal 2: Start frontend
npm run dev
# or
yarn dev
```

### Test Changes:
```bash
# Backend changes? Restart the Deno server (Ctrl+C, then re-run)

# Frontend changes? They hot-reload automatically
```

---

## 📊 API Endpoints (40+)

All endpoints are clean paths without Supabase prefixes:

### Authentication
- `POST /users/login` - Login
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Numbers Database
- `GET /database/clients` - Get available numbers
- `POST /database/clients/import` - Upload numbers
- `POST /database/clients/assign` - Assign with filters (customerType, airplane!)
- `DELETE /database/clients/:id` - Delete number
- `POST /database/clients/bulk-delete` - Delete multiple

### Assignments
- `GET /assignments?agentId=xxx` - Get assignments
- `POST /assignments/claim` - Claim assignment
- `POST /assignments/mark-called` - Mark as called

### Call Logs
- `GET /call-logs?agentId=xxx` - Get call history
- `POST /call-logs` - Log a call

### Daily Progress
- `GET /daily-progress` - Get progress
- `POST /daily-progress` - Update progress
- `GET /daily-progress/check-reset` - Auto-reset check
- `POST /daily-progress/reset` - Manual reset

### Call Scripts
- `GET /call-scripts` - Get all scripts
- `POST /call-scripts` - Create script
- `POST /call-scripts/:id/activate` - Activate script
- `DELETE /call-scripts/:id` - Delete script
- `GET /call-scripts/active/:type` - Get active script

### Promotions
- `GET /promotions` - Get all promotions
- `POST /promotions` - Create promotion
- `PUT /promotions/:id` - Update promotion
- `DELETE /promotions/:id` - Delete promotion

### Settings
- `GET /smtp-settings` - Get SMTP config
- `POST /smtp-settings` - Update SMTP config
- `POST /smtp-test` - Test SMTP
- `GET /threecx-settings` - Get 3CX config
- `POST /threecx-settings` - Update 3CX config

### Archive
- `GET /archive?type=xxx` - Get archived items
- `POST /archive` - Archive item
- `POST /archive/restore` - Restore from archive

### Audit
- `GET /login-audit` - Get login history

### Health
- `GET /health` - Server health check

---

## ✨ Key Features

### Smart Number Assignment
Filter numbers by:
- **Customer Type:** Retails, Corporate, Channel
- **Airplane/Flight:** Specific flight numbers
- **Count:** How many to assign

```bash
POST /database/clients/assign
{
  "agentId": "agent-123",
  "filters": {
    "customerType": "Corporate",
    "airplane": "BA123",
    "count": 50
  }
}
```

### Daily Auto-Reset
- Automatically resets call progress at midnight
- Manual reset available
- Per-user progress tracking

### Role-Based Access
- **Admin:** Full control
- **Manager:** Team oversight + granular permissions
- **Agent:** Assigned numbers only

---

## 🎊 You're Free from Supabase!

**Backend:** ✅ Pure Deno + MongoDB  
**Frontend:** ✅ Clean API calls  
**Deployment:** ✅ Deploy anywhere  
**Flexibility:** ✅ Full control  

### No More:
- ❌ Supabase dashboard
- ❌ Supabase Functions limits
- ❌ Supabase-specific deployment
- ❌ Supabase environment variables
- ❌ Supabase auth headers

### Now You Have:
- ✅ Standard Deno server
- ✅ MongoDB Atlas (industry standard)
- ✅ Deploy to any platform
- ✅ Full source code control
- ✅ Standard REST API

---

## 🎯 Quick Commands Reference

```bash
# Start backend locally
cd backend && deno run --allow-net --allow-env server.tsx

# Test health
curl http://localhost:8000/health

# Deploy to Deno Deploy
deployctl deploy --project=your-project server.tsx

# Deploy to Railway
cd backend && railway up

# Deploy to Render
# (Use web dashboard, point to /backend/server.tsx)

# Deploy to Fly.io
cd backend && flyctl deploy
```

---

## 📞 Support

**Backend Code:** `/backend/`  
**Frontend Config:** `/utils/config.tsx`  
**MongoDB:** https://cloud.mongodb.com  
**Deno:** https://deno.land  

---

**🎉 Congratulations! You're running a pure MongoDB backend with zero Supabase dependencies!**

*Deploy anywhere. Scale anywhere. Own your stack.* 🚀
