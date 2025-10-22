# ⚡ START BACKEND NOW!

## 🔴 Error: Backend Server Not Running

You're seeing this error because the backend server isn't started yet:
```
Failed to fetch
Cannot connect to backend at http://localhost:8000
```

---

## ✅ Fix It in 30 Seconds!

### Step 1: Open New Terminal
Keep your current terminal running (the one with `npm run dev`)

### Step 2: Run This Command
```bash
cd backend && deno run --allow-net --allow-env server.tsx
```

### Step 3: Wait for Success Message
You should see:
```
🚀 BTM Travel CRM Server running on MongoDB!
📊 Database: btm_travel_crm @ cluster0.vlklc6c.mongodb.net
✅ All Supabase dependencies removed!
Listening on http://localhost:8000/
```

### Step 4: Refresh Your Browser
The app will automatically detect the backend and load!

---

## 🎯 What You Need Running

You need **TWO terminals** running at the same time:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend && deno run --allow-net --allow-env server.tsx
```

---

## 🔧 Don't Have Deno?

Install it first (1 minute):

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

After installing, restart your terminal and run the backend command!

---

## ✨ That's It!

Once both are running:
1. Open http://localhost:3000 (or your frontend port)
2. Login with username: `admin`, password: `admin123`
3. Start using your CRM!

---

## 🆘 Still Having Issues?

Check:
- ✅ Deno is installed: `deno --version`
- ✅ You're in the project root directory
- ✅ Both terminals are running
- ✅ No other app is using port 8000

---

**🚀 Your backend is pure Deno + MongoDB. No Supabase deployment needed!**
