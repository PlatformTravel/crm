# ⚡ START THE BACKEND SERVER NOW

## The Problem
Your frontend is trying to connect to the backend, but the backend server is **NOT RUNNING**.

## The Solution (Choose ONE method below)

---

## 🪟 **WINDOWS USERS** - Double-click this file:
```
START-BACKEND-SERVER.bat
```

**OR** open Command Prompt and run:
```cmd
cd backend
deno run --allow-all server.tsx
```

---

## 🍎 **MAC/LINUX USERS** - Run in Terminal:

### Option 1: Use the start script
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Option 2: Start directly with Deno
```bash
cd backend
deno run --allow-all server.tsx
```

---

## ✅ How to Know It's Working

You should see this output:
```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢                                                         🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
🟢  VERSION: 9.2.0 - CALL TRACKER INTEGRATED!             🟢
🟢                                                         🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
```

---

## 🚨 Common Issues

### "deno: command not found"
**You need to install Deno first:**

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

Then restart your terminal and try again.

---

### Port Already in Use
If you see "Address already in use" error:

**Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F
```

**Mac/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

Then start the server again.

---

## 📝 Important Notes

1. **Keep the terminal window open** - The server runs in this terminal
2. **Don't close it** - Closing the terminal stops the server
3. **Wait 10-30 seconds** after starting for MongoDB to connect
4. **Refresh your browser** once you see "FULLY OPERATIONAL"

---

## 🎯 Quick Test

Once the server is running, open your browser and visit:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB Connected)"
}
```

✅ If you see this, your backend is working perfectly!

---

## 🆘 Still Having Issues?

1. Make sure you're in the correct directory
2. Check that Deno is installed: `deno --version`
3. Verify port 8000 is not being used by another application
4. Try the force restart scripts in the backend folder

---

**After starting the server, refresh your CRM application in the browser!**
