# ⚡ BTM Travel CRM - Backend Startup Guide

## 🚨 SEEING THIS ERROR?
```
[ADMIN] ❌ Backend not available - user management requires MongoDB connection
```

**Don't worry! This is easy to fix. Just follow the steps below.**

---

## 🎯 THE PROBLEM
The BTM Travel CRM requires a MongoDB backend server to be running. Right now, it's not running on your computer.

## ✅ THE SOLUTION
Start the backend server using one of the methods below:

---

## 📋 METHOD 1: Automatic Scripts (EASIEST) ⭐

### For Windows:
1. **Find this file** in your project folder:
   ```
   🔴-START-BACKEND-FIXED.bat
   ```
2. **Double-click it**
3. A black command window will open
4. **Wait** for these messages:
   ```
   🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
   🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
   🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
   
   [MongoDB] ✅ Connected successfully
   🚀 Server running on http://localhost:8000
   ```
5. **DO NOT CLOSE THE WINDOW!** Keep it open while using the CRM
6. Go back to your browser and **refresh the page**
7. The error should be gone! ✅

### For Mac/Linux:
1. **Open Terminal** (Applications → Utilities → Terminal)
2. **Navigate** to your project folder:
   ```bash
   cd /path/to/your/project
   ```
3. **Make the script executable:**
   ```bash
   chmod +x 🔴-START-BACKEND-FIXED.sh
   ```
4. **Run the script:**
   ```bash
   ./🔴-START-BACKEND-FIXED.sh
   ```
5. **Wait** for the success messages (same as Windows above)
6. **Keep the Terminal OPEN!**
7. Go back to your browser and **refresh the page**
8. The error should be gone! ✅

---

## 📋 METHOD 2: Manual Command

If the scripts above don't work, you can start the backend manually:

### Step 1: Open Terminal/Command Prompt
- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Applications → Utilities → Terminal
- **Linux:** Ctrl + Alt + T

### Step 2: Navigate to Project
```bash
cd /path/to/your/BTMTravelCRM/project
```

### Step 3: Go to Backend Folder
```bash
cd backend
```

### Step 4: Start the Server
```bash
deno run --allow-all server.tsx
```

### Step 5: Wait for Success Messages
You should see:
```
🟢 BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅
[MongoDB] ✅ Connected successfully
🚀 Server running on http://localhost:8000
```

### Step 6: Keep It Running
- **DO NOT CLOSE** the terminal/command window
- Leave it running in the background
- Go back to your browser and refresh

---

## ✅ HOW TO VERIFY IT'S WORKING

After starting the backend, you should see:

### In the Terminal/Command Window:
```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢

[MongoDB] ✅ Connected successfully
🚀 Server running on http://localhost:8000
```

### In Your Browser (after refreshing):
- ✅ The error message disappears
- ✅ A green "Backend Server Status" indicator appears in the top-right corner
- ✅ You can now access Admin Settings and User Management
- ✅ All database features work normally

---

## ⚠️ VERY IMPORTANT REMINDERS

### 1. Keep the Window Open
- **DO NOT CLOSE** the terminal/command window while using the CRM
- If you close it, the backend stops and you'll see the error again
- Think of it as the "engine" - it needs to keep running

### 2. Start Every Time
- You need to start the backend **every time** you want to use the CRM
- It doesn't start automatically (yet)
- Make it part of your routine: Start backend → Use CRM → Stop backend when done

### 3. How to Stop
- When you're done with the CRM, you can stop the backend
- Press `Ctrl + C` in the terminal/command window
- Or just close the window

### 4. Restart If Needed
- If you accidentally close the window, just start it again
- Follow the same steps above
- Your data is safe - it's stored in MongoDB Atlas (cloud)

---

## 🔧 TROUBLESHOOTING

### Problem: "Deno is not installed"
**What it means:** The Deno runtime is not installed on your computer

**How to fix:**
1. Go to https://deno.land/
2. Follow the installation instructions for your OS:
   - **Windows:** Run in PowerShell:
     ```powershell
     irm https://deno.land/install.ps1 | iex
     ```
   - **Mac/Linux:** Run in Terminal:
     ```bash
     curl -fsSL https://deno.land/install.sh | sh
     ```
3. Restart your terminal/command prompt
4. Try starting the backend again

---

### Problem: "Port 8000 already in use"
**What it means:** Another Deno process is already using port 8000

**How to fix:**
- **Windows:**
  ```cmd
  taskkill /F /IM deno.exe
  ```
- **Mac/Linux:**
  ```bash
  pkill -9 deno
  ```
- Then try starting the backend again

---

### Problem: "MongoDB connection failed"
**What it means:** The backend can't connect to MongoDB Atlas

**Possible causes:**
- ❌ No internet connection (MongoDB Atlas is cloud-based)
- ❌ Internet is slow or unstable
- ❌ MongoDB credentials are wrong
- ❌ Your IP address is not whitelisted in MongoDB Atlas

**How to fix:**
1. **Check your internet connection**
2. **Wait a moment** - MongoDB Atlas might be slow to respond
3. **Check MongoDB Atlas:**
   - Log in to https://cloud.mongodb.com/
   - Go to Network Access
   - Make sure your IP is whitelisted (or use `0.0.0.0/0` for development)
4. **Verify credentials** in `backend/mongodb.tsx`

---

### Problem: Backend keeps crashing or stopping
**How to fix:**
1. Check the terminal for error messages
2. Make sure you're not accidentally closing the window
3. Verify port 8000 is not being used by another app
4. Check your internet connection
5. Try restarting your computer
6. Run the startup script again

---

### Problem: Scripts won't run on Mac/Linux
**How to fix:**
```bash
chmod +x 🔴-START-BACKEND-FIXED.sh
chmod +x 🔴-START-EVERYTHING.sh
```
Then try running them again.

---

## 📚 ADDITIONAL RESOURCES

For more detailed help, check these files in your project folder:
- 📄 `🚀-START-BACKEND-HERE.md` - Detailed startup guide
- 📄 `✅-BACKEND-CONNECTION-GUIDE.md` - Complete troubleshooting
- 📄 `🚀-OPEN-THIS-TO-FIX-BACKEND-ERROR.html` - Visual guide (open in browser)
- 📄 `QUICK-START.md` - General quick start guide

---

## 🎯 QUICK CHECKLIST

Before using the CRM, make sure:
- [ ] Deno is installed on your computer
- [ ] You've started the backend server
- [ ] The terminal/command window is OPEN and shows "FULLY OPERATIONAL"
- [ ] You see "[MongoDB] ✅ Connected successfully"
- [ ] You've refreshed your browser
- [ ] The green status indicator appears in the CRM

---

## 📞 STILL NEED HELP?

If you're still having issues after trying everything above:

1. **Check** that the terminal shows "SERVER - FULLY OPERATIONAL"
2. **Verify** the URL in `utils/config.tsx` is `http://localhost:8000`
3. **Test** by visiting http://localhost:8000/health in your browser
   - You should see: `{"status":"ok","mongodb":"connected"}`
4. **Check** browser console (F12) for error messages
5. **Ensure** no firewall is blocking port 8000
6. **Try** restarting both the backend and your browser

---

## 🚀 AFTER EVERYTHING IS WORKING

Once the backend is running and you see the success messages:

1. ✅ Refresh your browser
2. ✅ The error message will disappear
3. ✅ You'll see a green "Backend Server Status" indicator
4. ✅ All features will work: user management, database, assignments, etc.
5. ✅ You're ready to use the BTM Travel CRM!

**Remember:** Keep the backend terminal/window OPEN while using the CRM!

---

**Version:** Backend 9.2.0  
**Last Updated:** November 1, 2025  
**MongoDB:** Atlas Cloud Database  
**Server:** Deno Runtime on localhost:8000
