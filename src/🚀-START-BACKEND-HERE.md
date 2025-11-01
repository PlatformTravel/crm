# 🚀 START BACKEND SERVER - Simple Instructions

## ⚠️ IMPORTANT: Backend Required
The BTM Travel CRM requires the backend server to be running for user management and database operations.

---

## 🆕 NEW! IMPROVED STARTUP SCRIPTS

We've created improved startup scripts with better error handling and diagnostics:
- **Windows:** `🔴-START-BACKEND-FIXED.bat`
- **Mac/Linux:** `🔴-START-BACKEND-FIXED.sh`

These new scripts automatically:
- ✅ Check if Deno is installed
- ✅ Kill any existing Deno processes to prevent port conflicts
- ✅ Provide clear error messages
- ✅ Show helpful instructions

---

## 📋 Quick Start (Choose Your Method)

### Method 1: NEW Improved Scripts ⭐ MOST RECOMMENDED

#### Windows:
1. Navigate to your project folder
2. Double-click: **`🔴-START-BACKEND-FIXED.bat`**
3. Wait for the green "✅ MongoDB connected successfully" message
4. **Keep the window OPEN** (don't close it!)

#### Mac/Linux:
1. Open Terminal in your project folder
2. Run: `chmod +x 🔴-START-BACKEND-FIXED.sh`
3. Then run: `./🔴-START-BACKEND-FIXED.sh`
4. Wait for the green "✅ MongoDB connected successfully" message
5. **Keep the terminal OPEN** (don't close it!)

---

### Method 2: Original Scripts (Still Works)

#### Windows:
1. Navigate to your project folder
2. Double-click: **`🔴-START-EVERYTHING.bat`**
3. Wait for the green "✅ MongoDB connected successfully" message
4. **Keep the window OPEN** (don't close it!)

#### Mac/Linux:
1. Open Terminal in your project folder
2. Run: `chmod +x 🔴-START-EVERYTHING.sh`
3. Then run: `./🔴-START-EVERYTHING.sh`
4. Wait for the green "✅ MongoDB connected successfully" message
5. **Keep the terminal OPEN** (don't close it!)

---

### Method 3: Manual Command (If scripts don't work)

Open a terminal/command prompt in your project folder and run:

```bash
cd backend
deno run --allow-net --allow-env --allow-read --allow-write server.tsx
```

Wait for these success messages:
```
[MongoDB] ✅ Connected successfully
🚀 BTM Travel CRM Server running on MongoDB!
```

---

## ✅ How to Know It's Working

You should see these messages in your terminal:

```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢                                                         🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
🟢  VERSION: 9.2.0 - CALL TRACKER INTEGRATED!             🟢
🟢                                                         🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢

[MongoDB] ✅ Connected successfully
🚀 Server running on http://localhost:8000
```

---

## 🚨 Important Reminders

1. **Keep the terminal/window OPEN** while using the CRM
2. Closing it will stop the backend server
3. You need to start it every time you want to use the CRM
4. The frontend will show an "Offline Mode" indicator if the backend is not running

---

## 🔧 Troubleshooting

### Problem: "Connection refused" or "Backend not available"
**Solution:** The backend server is not running. Follow the Quick Start instructions above.

### Problem: Scripts won't run on Mac/Linux
**Solution:** Run `chmod +x *.sh` in the project root to make all scripts executable.

### Problem: "MongoDB connection failed"
**Solution:** 
1. Check your internet connection (MongoDB Atlas requires internet)
2. Verify your MongoDB credentials in `backend/mongodb.tsx`
3. Ensure your IP is whitelisted in MongoDB Atlas

### Problem: Port 8000 already in use
**Solution:** 
1. Kill any existing Deno processes
2. On Windows: `taskkill /F /IM deno.exe`
3. On Mac/Linux: `pkill deno`
4. Then restart the backend

---

## 🎯 Next Steps

Once the backend is running:
1. Open your browser to the frontend
2. You should see the login screen
3. The "Offline Mode" indicator should NOT appear
4. You can now log in and use the CRM

---

## 📞 Need Help?

### 📚 Comprehensive Guides Available:
- **`⚡-BACKEND-STARTUP-README.md`** - Complete startup guide with troubleshooting
- **`✅-BACKEND-CONNECTION-GUIDE.md`** - Troubleshooting specific connection issues
- **`🚀-OPEN-THIS-TO-FIX-BACKEND-ERROR.html`** - Visual guide (open in browser)
- **`QUICK-START.md`** - General quick start guide
- **`backend/README.md`** - Backend-specific documentation

### 🔗 Other Resources:
- Ensure Deno is installed: https://deno.land/
- MongoDB Atlas: https://cloud.mongodb.com/

---

**Last Updated:** November 1, 2025  
**New Scripts Added:** November 1, 2025
