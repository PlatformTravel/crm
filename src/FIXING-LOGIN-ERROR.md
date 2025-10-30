# 🔧 Fixing "Cannot connect to backend server" Error

## What's the Problem?

You're seeing this error:
```
[ADMIN] Error loading settings: Error: Cannot connect to backend server at http://localhost:8000.
```

This means the **backend server is not running**. The BTM Travel CRM needs a backend server to work.

## The Solution (Super Simple)

### Windows Users

1. **Double-click** the file: `START-BACKEND-SERVER.bat`
2. A terminal window will open showing the server starting
3. Wait until you see: `🟢 BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅`
4. **Go back to your browser** and **refresh the page** (press F5)
5. Login with: **admin** / **admin123**

### Mac/Linux Users

1. Open Terminal
2. Navigate to your project folder
3. Run these commands:
```bash
chmod +x START-BACKEND-SERVER.sh
./START-BACKEND-SERVER.sh
```
4. Wait until you see: `🟢 BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅`
5. **Go back to your browser** and **refresh the page** (press F5 or Cmd+R)
6. Login with: **admin** / **admin123**

### Alternative Method (Any OS)

Open terminal/command prompt and run:
```bash
cd backend
deno run --allow-all server.tsx
```

## Don't Have Deno Installed?

If you get "deno: command not found", you need to install Deno first.

### Install Deno

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell - Run as Administrator):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Or download directly:** https://deno.land/

After installing, **restart your terminal** and try again.

## How to Know It's Working?

When the backend server starts successfully, you'll see:

```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢                                                       🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅      🟢
🟢  VERSION: 9.1.0 - MONGODB AUTO-INIT!               🟢
🟢                                                       🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢

═══════════════════════════════════════════════════════════
📅 Server started: [timestamp]
✅ ALL 53+ endpoints loaded and verified
✅ MongoDB connecting...
🌐 Listening on http://localhost:8000
═══════════════════════════════════════════════════════════
```

You can also verify by opening this in your browser:
http://localhost:8000/health

You should see:
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running",
  "mongodb": "connected"
}
```

## Troubleshooting

### Port 8000 Already in Use

If you see an error about port 8000 already being in use:

**Find what's using it:**
- **Mac/Linux:** `lsof -i :8000`
- **Windows:** `netstat -ano | findstr :8000`

**Kill the process:**
- **Mac/Linux:** `lsof -ti:8000 | xargs kill -9`
- **Windows:** `taskkill /PID [PID_NUMBER] /F`

Or change the port in `/utils/config.tsx` to use a different port (e.g., 8001).

### MongoDB Connection Issues

If you see MongoDB connection errors, **don't worry!** The system has fallbacks:

1. ✅ **Login still works** using localStorage (browser storage)
2. ✅ The server will keep trying to connect to MongoDB in the background
3. ✅ All user authentication works without MongoDB

The default admin login (**admin** / **admin123**) will always work!

### Firewall Issues

If your firewall blocks the connection:

1. Allow Deno through your firewall
2. Or temporarily disable firewall for testing
3. Make sure localhost (127.0.0.1) connections are allowed

## What Happens After Login?

1. First time login will **auto-initialize the database**
2. You'll see a success message
3. You can start using the CRM immediately
4. Create more users in the Admin panel

## Keep Backend Running

**Important:** Keep the terminal window open while using the CRM!

- Closing the terminal = Backend stops = Login fails
- You can minimize it, but don't close it
- To stop the server: Press **Ctrl+C** in the terminal

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Browser        │  →   │  Backend Server  │  →   │  MongoDB    │
│  (Frontend)     │      │  (Deno + Node)   │      │  (Cloud)    │
│                 │      │                  │      │             │
│  ✅ Running     │      │  ❌ NOT RUNNING  │      │  ✅ Ready   │
│  (React App)    │      │  ← START THIS!   │      │  (Atlas)    │
└─────────────────┘      └──────────────────┘      └─────────────┘
     Port 5173               Port 8000                 Cloud
```

The error is because the middle part (Backend Server) is not running!

## Summary

1. **Start the backend:** Run `START-BACKEND-SERVER.bat` or `START-BACKEND-SERVER.sh`
2. **Wait for confirmation:** Look for "FULLY OPERATIONAL! ✅"
3. **Refresh browser:** Press F5
4. **Login:** Use admin / admin123
5. **Done!** 🎉

Need more help? Check:
- `START-BACKEND.md` - Detailed backend instructions
- `backend/README.md` - Backend-specific documentation
- Browser console (F12) - See detailed error logs
