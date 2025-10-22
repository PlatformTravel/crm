# 📚 Documentation Index

## 🚀 Quick Start (Start Here!)

### **[START_HERE_MONGODB.md](/START_HERE_MONGODB.md)** ⭐
**Your first stop!** Quick overview with deployment commands and login info.

---

## 🎯 Deployment Guides

### **[🎯_MONGODB_READY_TO_DEPLOY.md](/🎯_MONGODB_READY_TO_DEPLOY.md)**
Quick reference guide with all essential info in one place.

### **[DEPLOY_CHECKLIST.md](/DEPLOY_CHECKLIST.md)**
Step-by-step deployment checklist with testing procedures.

### **[DEPLOY_MONGODB_BACKEND.md](/DEPLOY_MONGODB_BACKEND.md)**
Comprehensive deployment guide with multiple hosting options.

---

## ✅ Migration Information

### **[✅_SUPABASE_REMOVED_MONGODB_READY.md](/✅_SUPABASE_REMOVED_MONGODB_READY.md)**
Complete breakdown of what was removed and what changed.

### **[MONGODB_MIGRATION_COMPLETE.md](/MONGODB_MIGRATION_COMPLETE.md)**
Migration overview with setup requirements and benefits.

### **[MIGRATION_SUMMARY.md](/MIGRATION_SUMMARY.md)**
Technical before/after comparison with code examples.

---

## 🏗️ Technical Documentation

### **[ARCHITECTURE.md](/ARCHITECTURE.md)**
System architecture diagrams and data flow examples.

---

## 📋 File Structure

```
Root
├── 📚 START_HERE_MONGODB.md              ← START HERE!
├── 🎯 MONGODB_READY_TO_DEPLOY.md
├── ✅ SUPABASE_REMOVED_MONGODB_READY.md
├── 📚 DOCUMENTATION_INDEX.md             ← You are here
│
├── Deployment Guides
│   ├── DEPLOY_CHECKLIST.md
│   ├── DEPLOY_MONGODB_BACKEND.md
│   └── DEPLOY_NOW.txt
│
├── Migration Docs
│   ├── MONGODB_MIGRATION_COMPLETE.md
│   └── MIGRATION_SUMMARY.md
│
├── Technical Docs
│   └── ARCHITECTURE.md
│
├── Backend Code
│   └── supabase/functions/make-server-8fff4b3c/
│       ├── index.tsx           ← MongoDB server (40+ endpoints)
│       ├── mongodb.tsx         ← MongoDB connection utilities
│       ├── deno.json           ← Deno configuration
│       └── import_map.json
│
├── Frontend Code
│   ├── App.tsx                 ← Main application
│   ├── components/             ← React components
│   ├── utils/
│   │   ├── config.tsx          ← Backend URL configuration
│   │   └── backendService.tsx  ← API service layer
│   └── styles/
│       └── globals.css
│
└── Old Documentation
    ├── README.md
    ├── START_HERE.md
    ├── ✅_BACKEND_UPDATED_READY_TO_DEPLOY.md
    └── 🎯_YOUR_EDITS_NOW_SUPPORTED.txt
```

---

## 📖 Documentation by Purpose

### "I want to deploy the backend"
1. Read: **[START_HERE_MONGODB.md](/START_HERE_MONGODB.md)**
2. Follow: **[DEPLOY_CHECKLIST.md](/DEPLOY_CHECKLIST.md)**
3. Reference: **[DEPLOY_MONGODB_BACKEND.md](/DEPLOY_MONGODB_BACKEND.md)**

### "I want to understand what changed"
1. Read: **[✅_SUPABASE_REMOVED_MONGODB_READY.md](/✅_SUPABASE_REMOVED_MONGODB_READY.md)**
2. Deep dive: **[MIGRATION_SUMMARY.md](/MIGRATION_SUMMARY.md)**
3. Overview: **[MONGODB_MIGRATION_COMPLETE.md](/MONGODB_MIGRATION_COMPLETE.md)**

### "I want to understand the architecture"
1. Read: **[ARCHITECTURE.md](/ARCHITECTURE.md)**
2. Reference backend: `/supabase/functions/make-server-8fff4b3c/`
3. Reference frontend: `/components/` and `/utils/`

### "I want to configure the system"
1. MongoDB connection: `/supabase/functions/make-server-8fff4b3c/mongodb.tsx` (line 17)
2. Backend URL: `/utils/config.tsx`
3. SMTP settings: Admin panel after login
4. 3CX settings: Admin panel after login

---

## 🎯 Quick Reference

### Default Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Action:** Change password immediately after login!

### MongoDB Connection
- **Cluster:** `cluster0.vlklc6c.mongodb.net`
- **Database:** `btm_travel_crm`
- **Location:** Hardcoded in `mongodb.tsx` (line 17)
- **Console:** https://cloud.mongodb.com

### Backend URL
- **Production:** `https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c`
- **Configuration:** `/utils/config.tsx`
- **Hosting:** Supabase Functions (can be changed)

### Collections (11 total)
1. users
2. numbers_database (with customerType & airplane)
3. number_assignments
4. call_logs
5. call_scripts
6. promotions
7. daily_progress
8. smtp_settings
9. threecx_settings
10. archive
11. login_audit

### API Endpoints (40+)
- Authentication: `/users/login`
- Users: `/users` (GET, POST, PUT, DELETE)
- Numbers: `/database/clients/*`
- Assignments: `/assignments/*`
- Call Logs: `/call-logs`
- Daily Progress: `/daily-progress`
- Promotions: `/promotions`
- Settings: `/smtp-settings`, `/threecx-settings`
- Archive: `/archive`
- And more...

---

## 🔥 Key Features

### Smart Number Assignment
Filter by:
- **Customer Type:** Retails, Corporate, Channel
- **Airplane/Flight:** Specific flight numbers
- **Status:** Available, assigned, archived

### 3CX Phone Integration
- Click-to-call functionality
- Active call panel with controls
- Automatic call logging
- Call history & analytics

### Role-Based Access Control
- **Admin:** Full system access
- **Manager:** Team oversight + granular permissions
- **Agent:** Assigned numbers + customer service

### Daily Progress Tracking
- Auto-reset at midnight
- Individual & team targets
- Real-time progress monitoring

---

## 🛠️ Common Tasks

### Deploy Backend
```bash
supabase login
supabase link --project-ref biegmtgijxitiqydzhdk
supabase functions deploy make-server-8fff4b3c
```

### Test Backend
```bash
curl https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c/health
```

### View Logs
```bash
supabase functions logs make-server-8fff4b3c
```

### Change Backend URL
Edit `/utils/config.tsx`:
```tsx
export const BACKEND_URL = 'https://your-new-url.com';
```

### Change MongoDB Connection
Edit `/supabase/functions/make-server-8fff4b3c/mongodb.tsx` (line 17):
```tsx
const MONGODB_URI = 'mongodb+srv://...';
```

---

## 💡 Tips & Best Practices

### After First Deployment
1. ✅ Test health endpoint
2. ✅ Login with default admin
3. ✅ Change admin password
4. ✅ Create manager & agent users
5. ✅ Configure SMTP settings
6. ✅ Configure 3CX settings
7. ✅ Upload numbers to database
8. ✅ Assign numbers to agents

### For Production Use
1. ✅ Change all default passwords
2. ✅ Set up MongoDB backups (auto-enabled in Atlas)
3. ✅ Configure proper email server
4. ✅ Test 3CX integration thoroughly
5. ✅ Create proper user roles & permissions
6. ✅ Monitor MongoDB Atlas dashboard regularly

### For Troubleshooting
1. Check backend logs: `supabase functions logs`
2. Check MongoDB Atlas dashboard
3. Check browser console for frontend errors
4. Verify backend URL in `/utils/config.tsx`
5. Test health endpoint first

---

## 📞 Support Resources

### External Resources
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Supabase Docs:** https://supabase.com/docs
- **Deno Docs:** https://deno.land
- **MongoDB Docs:** https://docs.mongodb.com

### Your System
- **Backend Code:** `/supabase/functions/make-server-8fff4b3c/`
- **Frontend Code:** `/components/` and `/utils/`
- **Config:** `/utils/config.tsx`

---

## 🎊 You're All Set!

Everything you need to deploy and run your MongoDB-powered BTM Travel CRM is documented here!

**Start with:** [START_HERE_MONGODB.md](/START_HERE_MONGODB.md)

**Questions?** Check the relevant documentation above!

**Ready to deploy?** Follow the [DEPLOY_CHECKLIST.md](/DEPLOY_CHECKLIST.md)!

---

*Happy calling!* 📞 *Happy managing!* 📊 *Happy deploying!* 🚀
