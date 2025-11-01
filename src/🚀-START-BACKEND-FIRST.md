# 🚀 IMPORTANT: START BACKEND SERVER FIRST!

## The backend server is NOT running!

You're seeing connection errors because the backend MongoDB server needs to be started separately.

## Quick Start (Choose ONE method):

### Method 1: Double-Click Script (EASIEST)
**Windows:**
- Double-click: `START-BACKEND-SERVER.bat`

**Mac/Linux:**
- Double-click: `START-BACKEND-SERVER.sh`
- (If it doesn't work, open Terminal and run: `chmod +x START-BACKEND-SERVER.sh` then try again)

---

### Method 2: Command Line
**Open a NEW terminal/command prompt and run:**

```bash
cd backend
deno run --allow-all server.tsx
```

---

## ✅ How to know it's working:

You should see this in the terminal:

```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢                                                         🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
🟢  VERSION: 9.2.0 - CALL TRACKER INTEGRATED!             🟢
🟢                                                         🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
```

---

## 🔄 After Starting the Backend:

1. **Keep the terminal/command prompt open** (don't close it)
2. **Go back to your browser**
3. **Refresh the page** (F5 or Ctrl+R / Cmd+R)
4. **Login** to the CRM

---

## ⚠️ Common Issues:

### "Deno is not recognized"
- You need to install Deno first: https://deno.land/
- Or check if it's in your PATH

### Port 8000 already in use
- Close any other applications using port 8000
- Or run: `./backend/kill-old-servers.bat` (Windows) or `./backend/kill-old-servers.sh` (Mac/Linux)

### Permission denied (Mac/Linux)
- Run: `chmod +x START-BACKEND-SERVER.sh`
- Then try again

---

## 💡 Remember:

- **The backend server must ALWAYS be running** when using the CRM
- **Keep the terminal window open** while using the application
- **Don't close the terminal** or the backend will stop
- **Two separate processes**: Frontend (browser) + Backend (terminal)

---

## 🎯 Development Workflow:

1. **Terminal 1**: Run backend server (this guide)
2. **Terminal 2**: Run frontend dev server (if using Vite/npm)
3. **Browser**: Access the CRM application

---

## Need Help?

If you're still having issues:
1. Make sure Deno is installed: `deno --version`
2. Check if port 8000 is available
3. Look for error messages in the terminal
4. Check the backend/README.md for more details
