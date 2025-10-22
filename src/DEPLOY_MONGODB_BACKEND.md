# 🚀 Deploy Your MongoDB Backend - Complete Guide

## ✅ Ready to Deploy!

Your backend code is **100% ready** with MongoDB connection hardcoded. No secrets management needed!

---

## 📦 What You're Deploying

**Location:** `/supabase/functions/make-server-8fff4b3c/`

**Files:**
- `index.tsx` - Main server with 40+ REST API endpoints (MongoDB version)
- `mongodb.tsx` - MongoDB connection utility (connection string hardcoded)
- `deno.json` - Deno configuration with MongoDB dependency
- `import_map.json` - Import map

**Backend Features:**
- ✅ 11 MongoDB collections
- ✅ User authentication & login audit
- ✅ Numbers database with smart filtering by customer type & airplane
- ✅ Number assignment system
- ✅ Call logging & analytics
- ✅ SMTP & 3CX settings
- ✅ Promotions management
- ✅ Daily progress tracking
- ✅ Archive system
- ✅ Auto-reset functionality

---

## 🎯 Deployment Steps

### Option 1: Deploy to Supabase Functions (Current Setup)

Your backend is currently configured to deploy to Supabase Functions:

**URL:** `https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c`

**How to Deploy:**
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref biegmtgijxitiqydzhdk`
4. Deploy: `supabase functions deploy make-server-8fff4b3c`

**That's it!** No environment variables needed - MongoDB URI is hardcoded.

---

### Option 2: Deploy to Deno Deploy (Alternative)

You can also deploy to Deno Deploy for a pure Deno experience:

1. Go to https://dash.deno.com
2. Create a new project
3. Connect your Git repository or deploy via CLI
4. Point to `/supabase/functions/make-server-8fff4b3c/index.tsx`
5. Deploy!

Then update `/utils/config.tsx` with your new Deno Deploy URL:
```tsx
export const BACKEND_URL = 'https://your-project.deno.dev';
```

---

### Option 3: Deploy to Any Deno-Compatible Platform

Your backend is a standard Deno server. You can deploy it to:
- **Railway** (https://railway.app)
- **Render** (https://render.com)
- **Fly.io** (https://fly.io)
- Any platform that supports Deno

---

## 🧪 Test Your Deployment

After deploying, test the health endpoint:

```bash
curl https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB)",
  "timestamp": "2025-01-21T10:30:00.000Z",
  "version": "2.0.0-mongodb"
}
```

---

## 🎉 Default Admin Account

After first deployment, the system automatically creates:

**Username:** `admin`  
**Password:** `admin123`  
**Email:** `admin@btmtravel.net`  
**Role:** `admin`

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## 📊 MongoDB Atlas Dashboard

Monitor your database at: https://cloud.mongodb.com

**Database:** `btm_travel_crm`  
**Cluster:** `cluster0.vlklc6c.mongodb.net`

From the dashboard you can:
- View all collections
- Run queries
- Monitor performance
- Set up backups
- Configure alerts

---

## 🔥 Hot Features

### 1. Smart Number Assignment
- Filter by customer type: **Retails**, **Corporate**, **Channel**
- Filter by airplane/flight for targeted campaigns
- Automatic archiving when numbers are assigned

### 2. Call Tracking
- Real-time 3CX integration
- Automatic call logging
- Daily progress tracking with auto-reset
- Call history & analytics

### 3. Flexible Role System
- **Admin** - Full system access
- **Manager** - Team oversight + granular permissions
- **Agent** - Assigned numbers + customer service

### 4. Archive & Restore
- Automatic archiving on assignment
- One-click restore from archive
- Separate archives for numbers and promotions

---

## 🛠️ Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB Atlas dashboard to ensure cluster is running
- Verify IP whitelist in MongoDB Atlas (should allow all: 0.0.0.0/0)
- Check connection string format in `mongodb.tsx`

### "Function not found"
- Ensure you deployed to the correct project
- Check function name matches: `make-server-8fff4b3c`
- Verify deployment completed successfully

### "CORS error"
- The server has CORS headers configured for all origins (`*`)
- If issues persist, check browser console for specific error

---

## 📝 Next Steps After Deployment

1. ✅ Test the /health endpoint
2. ✅ Login with default admin account
3. ✅ Change admin password
4. ✅ Create manager & agent users
5. ✅ Upload numbers to database
6. ✅ Configure SMTP settings
7. ✅ Configure 3CX settings
8. ✅ Create call scripts
9. ✅ Assign numbers to agents
10. ✅ Start making calls! 🎉

---

## 🎨 Frontend Update (Optional)

Some frontend components still reference the old Supabase imports. To complete the cleanup:

**Replace in all components:**
```tsx
// OLD:
import { projectId, publicAnonKey } from '../utils/supabase/info';
const url = `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/endpoint`;
fetch(url, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } });

// NEW:
import { BACKEND_URL } from '../utils/config';
const url = `${BACKEND_URL}/endpoint`;
fetch(url, { headers: { 'Content-Type': 'application/json' } });
```

**Files to update:**
- `/components/ClientCRM.tsx`
- `/components/PromoSales.tsx`
- `/components/CustomerService.tsx`
- `/components/AdminSettings.tsx`
- `/components/ManagerDashboard.tsx`
- And ~15 others

This is **optional** - the app works fine as-is, but updating removes all Supabase references.

---

## 🎊 You're All Set!

Your MongoDB backend is ready to deploy. No secrets, no configuration, no hassle - just deploy and go!

**Questions?** Check the logs in your deployment platform or MongoDB Atlas dashboard.

**Happy calling! 📞**
