# ✅ Deployment Checklist - MongoDB Backend

## Pre-Deployment Verification

### Backend Files ✅
- [x] `/supabase/functions/make-server-8fff4b3c/index.tsx` - MongoDB version ready
- [x] `/supabase/functions/make-server-8fff4b3c/mongodb.tsx` - Connection string hardcoded
- [x] `/supabase/functions/make-server-8fff4b3c/deno.json` - MongoDB dependency added
- [x] No environment variables required!

### MongoDB Connection ✅
- [x] Connection string: `mongodb+srv://crm_db_user:...@cluster0.vlklc6c.mongodb.net/btm_travel_crm`
- [x] Database name: `btm_travel_crm`
- [x] Hardcoded in `mongodb.tsx` - no secrets needed!

### Frontend Configuration ✅
- [x] `/utils/config.tsx` - Backend URL configured
- [x] `/utils/backendService.tsx` - No Supabase auth headers
- [x] Backend URL: `https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c`

---

## Deployment Steps

### Step 1: Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link to Your Project
```bash
supabase link --project-ref biegmtgijxitiqydzhdk
```

### Step 4: Deploy the Function
```bash
cd supabase/functions/make-server-8fff4b3c
supabase functions deploy make-server-8fff4b3c
```

**That's it! No secrets to configure!**

---

## Post-Deployment Testing

### 1. Test Health Endpoint ✅
```bash
curl https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB)",
  "timestamp": "2025-01-21T...",
  "version": "2.0.0-mongodb"
}
```

### 2. Test MongoDB Connection ✅
The health endpoint will fail if MongoDB connection fails. If you get a 200 OK response, MongoDB is connected!

### 3. Test User Login ✅
```bash
curl -X POST https://biegmtgijxitiqydzhdk.supabase.co/functions/v1/make-server-8fff4b3c/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "admin-1",
    "username": "admin",
    "name": "Administrator",
    "role": "admin",
    ...
  }
}
```

### 4. Check MongoDB Atlas Dashboard ✅
1. Go to https://cloud.mongodb.com
2. Navigate to your cluster: `cluster0.vlklc6c.mongodb.net`
3. Click "Collections"
4. Verify `btm_travel_crm` database exists
5. Check that collections are being created (starts with `users`)

---

## First Login Checklist

### 1. Login with Default Admin ✅
- **URL:** Your app URL
- **Username:** `admin`
- **Password:** `admin123`

### 2. Immediately Change Password ⚠️
1. Go to Admin → Settings
2. Update admin password
3. Save changes

### 3. Create Users ✅
1. Go to Admin → User Management
2. Create Manager account(s)
3. Create Agent account(s)
4. Set permissions as needed

### 4. Configure SMTP Settings ✅
1. Go to Admin → SMTP Settings
2. Enter your email server details:
   - Host (e.g., smtp.gmail.com)
   - Port (465 for SSL, 587 for TLS)
   - Username & Password
   - From email & name
3. Test connection
4. Save settings

### 5. Configure 3CX Settings ✅
1. Go to Admin → 3CX Settings  
2. Enter your 3CX server details:
   - Server URL
   - Extension
   - API credentials
3. Test connection
4. Save settings

### 6. Create Call Scripts ✅
1. Go to Admin → Call Scripts
2. Create script for "Prospective Client"
3. Create script for "Existing Customer"
4. Activate the scripts

### 7. Upload Numbers Database ✅
1. Go to Clients and Customers Database
2. Click "Upload Numbers"
3. Prepare CSV with columns:
   - Name
   - Phone Number (+234 XXX XXX XXXX)
   - Email
   - Customer Type (Retails/Corporate/Channel)
   - Airplane (optional)
4. Upload file
5. Verify numbers appear in database

### 8. Assign Numbers to Agents ✅
1. Go to Manager Dashboard (or Admin)
2. Select numbers from database
3. Choose agent to assign
4. Optional: Use filters (Customer Type, Airplane)
5. Click "Assign Numbers"
6. Verify assignment in Agent's dashboard

---

## Verification Checklist

After deployment, verify these features work:

- [ ] User login (admin, manager, agent)
- [ ] Create/edit/delete users
- [ ] Upload numbers to database
- [ ] Assign numbers to agents
- [ ] View assigned numbers in Agent dashboard
- [ ] Click-to-call from number (3CX)
- [ ] Log calls manually
- [ ] View call history
- [ ] Daily progress tracking
- [ ] Create/edit promotions
- [ ] Send emails (SMTP)
- [ ] Archive and restore numbers
- [ ] Manager team overview
- [ ] Admin settings panel

---

## Troubleshooting

### ❌ "Cannot connect to MongoDB"
**Fix:**
1. Check MongoDB Atlas dashboard - ensure cluster is running
2. Verify IP whitelist: Go to Network Access in Atlas, ensure 0.0.0.0/0 is whitelisted
3. Check connection string in `mongodb.tsx` - ensure no typos

### ❌ "Function not found" 
**Fix:**
1. Verify deployment: `supabase functions list`
2. Ensure function name is `make-server-8fff4b3c`
3. Redeploy: `supabase functions deploy make-server-8fff4b3c`

### ❌ "Invalid credentials" on first login
**Fix:**
1. Wait 10 seconds for database initialization
2. Check MongoDB Atlas - verify `users` collection exists
3. Check logs: `supabase functions logs make-server-8fff4b3c`

### ❌ CORS errors in browser
**Fix:**
1. Server has CORS headers configured
2. Check browser console for specific error
3. Verify backend URL in `/utils/config.tsx` matches deployed function

---

## Monitoring

### View Logs
```bash
supabase functions logs make-server-8fff4b3c
```

### MongoDB Atlas Monitoring
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Navigate to "Metrics" tab
4. Monitor:
   - Connections
   - Operations per second
   - Query performance
   - Storage usage

---

## 🎉 You're Live!

Once you've completed this checklist:
- ✅ Backend deployed to Supabase Functions
- ✅ MongoDB connection verified
- ✅ Default admin account working
- ✅ Users created
- ✅ SMTP & 3CX configured
- ✅ Numbers uploaded
- ✅ Agents assigned

**Your BTM Travel CRM is production-ready! 🚀**

---

## Support

**Documentation:**
- `/MONGODB_MIGRATION_COMPLETE.md` - Overview
- `/DEPLOY_MONGODB_BACKEND.md` - Detailed deployment guide
- `/MIGRATION_SUMMARY.md` - Technical comparison

**External Resources:**
- MongoDB Atlas: https://cloud.mongodb.com
- Supabase Functions: https://supabase.com/docs/guides/functions
- Deno: https://deno.land

**Database:**
- Cluster: `cluster0.vlklc6c.mongodb.net`
- Database: `btm_travel_crm`
- Connection: Hardcoded in `mongodb.tsx`
