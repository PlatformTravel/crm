# 🚀 BTM Travel CRM - Quick Start

## ⚠️ IMPORTANT: You need to start the backend server first!

The login error you're seeing is because the backend server is not running.

## Quick Fix (3 Steps)

### Step 1: Open a Terminal

Open a new terminal/command prompt window

### Step 2: Start the Backend

**Windows - Double-click this file:**
```
START-BACKEND-SERVER.bat
```

**Mac/Linux - Run this command:**
```bash
chmod +x START-BACKEND-SERVER.sh
./START-BACKEND-SERVER.sh
```

**OR manually:**
```bash
cd backend
deno run --allow-all server.tsx
```

### Step 3: Refresh Your Browser

Once you see this message in the terminal:
```
🟢 BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅
```

Go back to your browser and refresh the page (F5 or Cmd+R)

## Login

Use these credentials:
- **Username:** admin
- **Password:** admin123

The database will auto-initialize on first login!

## Don't Have Deno?

Install it first:

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell as Admin):**
```powershell
irm https://deno.land/install.ps1 | iex
```

Or download from: https://deno.land/

## Still Having Issues?

1. Make sure no other program is using port 8000
2. Check your internet connection (needed for MongoDB)
3. Look at `START-BACKEND.md` for detailed troubleshooting
4. The fallback login works even if MongoDB is down!

## What's Happening?

The BTM Travel CRM has two parts:
1. **Frontend** (React app in browser) - Already running
2. **Backend** (Deno server with MongoDB) - You need to start this!

The error means #2 is not running yet.

## Architecture

```
Frontend (Browser)  →  Backend (Deno)  →  MongoDB (Cloud)
    Running!            NOT RUNNING         Atlas
                        ← START THIS!
```

Once the backend starts, everything will work!
