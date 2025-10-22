# 🚀 START YOUR CRM - Easy Mode!

## ⚡ The Easiest Way (One Command!)

### Windows:
Double-click `start-all.bat` or run:
```cmd
start-all.bat
```

### Mac/Linux:
```bash
chmod +x start-all.sh
./start-all.sh
```

**That's it!** Both frontend and backend will start automatically! 🎉

---

## 🔧 Manual Way (If You Prefer Control)

You need **TWO terminals** running at the same time:

### Terminal 1 - Backend:
```bash
cd backend
deno run --allow-net --allow-env server.tsx
```

**Wait for:** `✅ All Supabase dependencies removed! Listening on http://localhost:8000/`

### Terminal 2 - Frontend:
```bash
npm run dev
```

**Open:** http://localhost:3000 (or whatever port it shows)

---

## 📋 Current Error Explained

You're seeing:
```
Failed to fetch
Cannot connect to backend at http://localhost:8000
```

**Why?** Because the backend isn't running yet!

**Fix:** Use one of the methods above to start it!

---

## 🔐 Login After Starting

- **Username:** `admin`
- **Password:** `admin123`

---

## 🆘 Don't Have Deno?

### Windows (PowerShell - Run as Admin):
```powershell
irm https://deno.land/install.ps1 | iex
```

### Mac/Linux:
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**After installing:** Restart your terminal and use the startup commands above!

---

## ✅ How to Know It's Working

When the backend starts, you'll see:
```
🚀 BTM Travel CRM Server running on MongoDB!
📊 Database: btm_travel_crm @ cluster0.vlklc6c.mongodb.net
✅ All Supabase dependencies removed!
Listening on http://localhost:8000/
```

When the frontend starts, you'll see:
```
VITE v... ready in ...ms
➜  Local:   http://localhost:3000/
```

**Refresh your browser** and the "Failed to fetch" error will be gone! ✅

---

## 🎯 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Deno not found" | Install Deno (see above) |
| "Port 8000 in use" | Kill the process using port 8000 |
| "Port 3000 in use" | Kill the process or use different port |
| Still seeing error | Make sure BOTH terminals are running |

---

## 📚 What's Running?

```
Your Browser  →  Frontend (React)  →  Backend (Deno)  →  MongoDB Atlas
              localhost:3000        localhost:8000        Cloud Database
```

---

## 🎉 That's It!

1. **Start both servers** (use `start-all.bat` or `start-all.sh`)
2. **Wait for "Server running" messages**
3. **Open browser** to localhost:3000
4. **Login** with admin/admin123
5. **Enjoy your CRM!** 🚀

---

**💡 Pro Tip:** Keep both terminal windows visible so you can see the logs!
