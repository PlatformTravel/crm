# 🚀 START BACKEND SERVER

## Quick Start

The BTM Travel CRM requires a backend server to be running. Follow these simple steps:

### Option 1: Using Scripts (Recommended)

**Windows:**
```batch
cd backend
start.bat
```

**Mac/Linux:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

```bash
cd backend
deno run --allow-all server.tsx
```

### Option 3: Using Deno Tasks

```bash
cd backend
deno task start
```

## Verify It's Running

Open http://localhost:8000/health in your browser. You should see:
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running",
  "mongodb": "connected"
}
```

## Troubleshooting

### "deno: command not found"

You need to install Deno first:

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

Or download from: https://deno.land/

### Port Already in Use

If port 8000 is already in use, you need to:

1. Find and kill the process using port 8000:
   - **Mac/Linux:** `lsof -ti:8000 | xargs kill -9`
   - **Windows:** `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`

2. Or change the port in `/utils/config.tsx`

### MongoDB Connection Issues

The server uses MongoDB Atlas. If MongoDB can't connect:

1. Check your internet connection
2. The fallback login (admin/admin123) will still work from localStorage
3. MongoDB will retry automatically

## What Happens When Backend Starts

You should see output like:
```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅    🟢
🟢  VERSION: 9.1.0 - MONGODB AUTO-INIT!             🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢

✅ Server started
✅ ALL 53+ endpoints loaded
✅ MongoDB connecting...
🌐 Listening on http://localhost:8000
```

## Next Steps

Once the backend is running:

1. Go back to your browser
2. Refresh the page
3. Login with: **admin** / **admin123**
4. The database will auto-initialize on first login!

## Need Help?

- Check `/backend/RESTART-INSTRUCTIONS.md`
- Check the ConnectionStatus widget in the app (bottom right corner)
- Open browser console (F12) to see detailed error messages
