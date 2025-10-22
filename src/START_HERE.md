# 🎯 START HERE - BTM Travel CRM

## ✅ All Supabase Dependencies Removed!

Your CRM is now powered by **Pure Deno + MongoDB** with **ZERO** Supabase!

---

## 📁 What's New

### Backend Moved to `/backend/`

```
/backend/
├── server.tsx      ← Pure Deno server (40+ REST endpoints)
├── mongodb.tsx     ← MongoDB connection utilities
├── deno.json       ← Configuration
└── README.md       ← Backend documentation
```

**No more `/supabase/functions/`!** Just clean, pure Deno code.

---

## ⚡ Quick Start (2 Minutes)

### 1. Start Backend

```bash
cd backend
deno run --allow-net --allow-env server.tsx
```

### 2. Start Frontend

```bash
npm run dev
```

### 3. Login

- **URL:** http://localhost:3000
- **Username:** `admin`
- **Password:** `admin123`

✅ **Done!**

---

## 🎯 What Changed

| Before | After |
|--------|-------|
| Supabase Functions | Pure Deno Server |
| `/supabase/functions/make-server-8fff4b3c/` | `/backend/` |
| Supabase KV Store | MongoDB Atlas |
| Supabase Auth | Custom Auth |
| Complex paths | Clean REST paths |
| Vendor lock-in | Deploy anywhere! |

---

## 📚 Documentation

### Getting Started:
1. **[QUICK_START.md](/QUICK_START.md)** ⭐ - 2-minute setup guide

### Deployment:
2. **[DEPLOY_PURE_MONGODB.md](/DEPLOY_PURE_MONGODB.md)** - Deploy to production

### Backend:
3. **[/backend/README.md](/backend/README.md)** - API documentation

### Migration Info:
4. **[🎉_SUPABASE_COMPLETELY_REMOVED.md](/🎉_SUPABASE_COMPLETELY_REMOVED.md)** - What changed

---

## 🚀 Deploy to Production

### Deno Deploy (Recommended):
```bash
cd backend
deployctl deploy --project=btm-travel-crm server.tsx
```

Then update `/utils/config.tsx`:
```tsx
export const BACKEND_URL = 'https://btm-travel-crm.deno.dev';
```

### Other Options:
- Railway - `railway up`
- Render - Web dashboard
- Fly.io - `flyctl deploy`

**Full guide:** [DEPLOY_PURE_MONGODB.md](/DEPLOY_PURE_MONGODB.md)

---

## 🎨 Features

✅ **Smart Number Assignment** - Filter by customerType & airplane  
✅ **3CX Integration** - Click-to-call with active call panel  
✅ **Daily Auto-Reset** - Progress tracking resets at midnight  
✅ **Role-Based Access** - Admin, Manager, Agent with permissions  
✅ **Call Logging** - Comprehensive call history  
✅ **Archive System** - One-click archive & restore  
✅ **MongoDB Atlas** - Production-ready database  

---

## 🗄️ Database

**MongoDB Atlas:**
- Cluster: cluster0.vlklc6c.mongodb.net
- Database: btm_travel_crm  
- Console: https://cloud.mongodb.com

**11 Collections:**
- users, numbers_database, number_assignments
- call_logs, call_scripts, promotions
- daily_progress, smtp_settings, threecx_settings
- archive, login_audit

**Connection:** Hardcoded in `/backend/mongodb.tsx` (line 17)

---

## 🔧 Configuration

### Frontend: `/utils/config.tsx`
```tsx
// Development
export const BACKEND_URL = 'http://localhost:8000';

// Production (after deployment)
export const BACKEND_URL = 'https://your-deployed-url.com';
```

### Backend: `/backend/mongodb.tsx`
```tsx
// Line 17: MongoDB connection string
const MONGODB_URI = 'mongodb+srv://...';
```

---

## ✨ Key Benefits

### No Supabase:
- ❌ No Supabase Functions limits
- ❌ No Supabase environment variables
- ❌ No Supabase path prefixes
- ❌ No vendor lock-in

### Pure Stack:
- ✅ Standard Deno server
- ✅ MongoDB Atlas (industry standard)
- ✅ Clean REST API
- ✅ Deploy anywhere
- ✅ Full source control
- ✅ Zero secrets required

---

## 📞 Next Steps

1. ✅ **Run locally** (see Quick Start above)
2. ✅ **Test health endpoint:** `curl http://localhost:8000/health`
3. ✅ **Login and explore**
4. ✅ **Change admin password** (Admin → Settings)
5. ✅ **Configure SMTP & 3CX** (Admin panel)
6. ✅ **Create users** (Admin → User Management)
7. ✅ **Upload numbers** (Database Manager)
8. ✅ **Deploy to production** (when ready)

---

## 🆘 Need Help?

### Quick Answers:
- **Backend won't start?** Install Deno: https://deno.land
- **Can't connect to MongoDB?** Check MongoDB Atlas dashboard
- **Frontend can't reach backend?** Check `/utils/config.tsx`

### Documentation:
- [QUICK_START.md](/QUICK_START.md) - Setup guide
- [/backend/README.md](/backend/README.md) - API docs
- [DEPLOY_PURE_MONGODB.md](/DEPLOY_PURE_MONGODB.md) - Deployment

---

## 🎊 You're Free!

Your CRM is now:
- ✅ **Independent** - No Supabase
- ✅ **Flexible** - Deploy anywhere
- ✅ **Clean** - Standard stack
- ✅ **Powerful** - MongoDB + Deno
- ✅ **Yours** - Full control

---

**🚀 Ready to build something great!**

*Start with [QUICK_START.md](/QUICK_START.md) and you'll be up in 2 minutes!*
