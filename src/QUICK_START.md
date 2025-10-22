# ⚡ Quick Start - BTM Travel CRM

## 🚀 Get Running in 2 Minutes!

### Step 1: Start the Backend (1 minute)

```bash
cd backend
deno run --allow-net --allow-env server.tsx
```

**You'll see:**
```
🚀 BTM Travel CRM Server running on MongoDB!
📊 Database: btm_travel_crm @ cluster0.vlklc6c.mongodb.net
✅ All Supabase dependencies removed!
Listening on http://localhost:8000/
```

### Step 2: Test It Works (30 seconds)

Open a new terminal:
```bash
curl http://localhost:8000/health
```

**You should see:**
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB)",
  "version": "3.0.0-mongodb-standalone"
}
```

✅ **Backend is working!**

### Step 3: Start the Frontend (30 seconds)

```bash
npm run dev
# or
yarn dev
```

**Open:** http://localhost:3000 (or your frontend port)

### Step 4: Login

**Username:** `admin`  
**Password:** `admin123`

✅ **You're in!**

---

## 🎯 That's It!

Your CRM is now running with:
- ✅ Pure Deno backend on `http://localhost:8000`
- ✅ MongoDB Atlas database
- ✅ **NO** Supabase dependencies
- ✅ All features working

---

## 📝 Next Steps

1. **Change admin password** (Admin → Settings)
2. **Create users** (Admin → User Management)
3. **Configure SMTP** (Admin → SMTP Settings)
4. **Configure 3CX** (Admin → 3CX Settings)
5. **Upload numbers** (Database Manager)
6. **Assign to agents** (Manager Dashboard)
7. **Start calling!** 📞

---

## 🌐 Deploy to Production

When you're ready to deploy:

### Deno Deploy (Easiest):
```bash
cd backend
deployctl deploy --project=btm-travel-crm server.tsx
```

Then update `/utils/config.tsx`:
```tsx
export const BACKEND_URL = 'https://btm-travel-crm.deno.dev';
```

**Done!** 🎉

---

## 📚 Full Documentation

- **Backend:** `/backend/README.md`
- **Deployment:** `/DEPLOY_PURE_MONGODB.md`
- **Migration:** `/🎉_SUPABASE_COMPLETELY_REMOVED.md`

---

## 🆘 Troubleshooting

### Backend won't start?
Install Deno: https://deno.land/manual/getting_started/installation

### Can't connect to MongoDB?
Check MongoDB Atlas dashboard: https://cloud.mongodb.com  
Ensure cluster is running and IP whitelist allows all (0.0.0.0/0)

### Frontend can't reach backend?
Check `/utils/config.tsx` - should be `http://localhost:8000` for local dev

---

**🎊 Happy CRM-ing!**
