# ✅ BACKEND CONNECTION TROUBLESHOOTING GUIDE

## 🚨 ERROR MESSAGE
```
[ADMIN] ❌ Backend not available - user management requires MongoDB connection
```

---

## 🔍 WHAT THIS MEANS
The BTM Travel CRM frontend is running, but it cannot connect to the backend MongoDB server. User management, database operations, and most features require the backend to be running.

---

## 🎯 QUICK FIX - 3 STEPS

### Step 1: Check if Backend is Running
Look for a terminal/command prompt window that shows:
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

**If you see this:** Backend is running! Skip to Step 3.
**If you DON'T see this:** Continue to Step 2.

---

### Step 2: Start the Backend Server

#### ✅ EASIEST METHOD - Use Startup Script:

##### Windows:
1. Close any existing terminal windows running Deno
2. Navigate to your project root folder
3. **Double-click:** `🔴-START-BACKEND-FIXED.bat`
4. Wait for the success messages
5. **IMPORTANT:** Keep this window OPEN while using the CRM

##### Mac/Linux:
1. Close any existing terminal windows running Deno
2. Open Terminal in your project root folder
3. Make the script executable:
   ```bash
   chmod +x 🔴-START-BACKEND-FIXED.sh
   ```
4. Run the script:
   ```bash
   ./🔴-START-BACKEND-FIXED.sh
   ```
5. Wait for the success messages
6. **IMPORTANT:** Keep this terminal OPEN while using the CRM

---

#### 🔧 ALTERNATIVE METHOD - Manual Command:

If the scripts don't work, run manually:

1. Open a new terminal/command prompt
2. Navigate to your project root folder
3. Run these commands:
   ```bash
   cd backend
   deno run --allow-all server.tsx
   ```
4. Wait for success messages
5. Keep the terminal OPEN

---

### Step 3: Verify Connection

Once the backend is running, refresh your browser. You should see:

1. ✅ The error message disappears
2. ✅ A green "Backend Server Status" indicator appears in the top-right
3. ✅ User management features become available
4. ✅ No more "Offline Mode" warnings

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: "Deno is not installed"
**Solution:**
Install Deno from: https://deno.land/

**Windows:**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

---

### Issue 2: "Port 8000 already in use"
**Solution:**
Another Deno process is already using port 8000.

**Windows:**
```cmd
taskkill /F /IM deno.exe
```

**Mac/Linux:**
```bash
pkill -9 deno
```

Then restart the backend using Step 2 above.

---

### Issue 3: "MongoDB connection failed"
**Solution:**
This could be:
- ❌ No internet connection (MongoDB Atlas requires internet)
- ❌ MongoDB credentials are incorrect
- ❌ IP address not whitelisted in MongoDB Atlas

**To Fix:**
1. Check your internet connection
2. Verify MongoDB Atlas is accessible
3. Check `backend/mongodb.tsx` for correct credentials
4. Ensure your IP is whitelisted in MongoDB Atlas (or use 0.0.0.0/0 for all IPs during development)

---

### Issue 4: Backend keeps stopping/crashing
**Solution:**
1. Check the terminal for error messages
2. Make sure you're not accidentally closing the terminal window
3. Check that port 8000 is not being used by another application
4. Restart the backend with the startup scripts above

---

## 📋 CHECKLIST FOR SUCCESS

- [ ] Deno is installed
- [ ] Backend terminal/window is OPEN and running
- [ ] You see "SERVER - FULLY OPERATIONAL" message
- [ ] You see "MongoDB ✅ Connected successfully" message
- [ ] Port 8000 is available (not used by other apps)
- [ ] Internet connection is active
- [ ] Browser is refreshed after starting backend
- [ ] Green status indicator appears in top-right of CRM

---

## 🎯 BEST PRACTICES

1. **Always start the backend BEFORE using the CRM**
2. **Keep the backend terminal window OPEN** while using the CRM
3. **Don't close the backend terminal** until you're done with the CRM
4. **If you close the backend**, just run the startup script again
5. **Check the green status indicator** to confirm connection

---

## 🚀 NEXT STEPS

Once the backend is running and connected:

1. The error message will disappear
2. You can manage users in Admin Settings
3. All database features will work
4. The CRM is fully functional

---

## 📞 STILL HAVING ISSUES?

If you're still seeing the error after following all these steps:

1. Make sure the backend terminal shows "SERVER - FULLY OPERATIONAL"
2. Check that the URL in `utils/config.tsx` is `http://localhost:8000`
3. Try accessing http://localhost:8000/health in your browser
4. Check browser console for additional error messages
5. Make sure no firewall is blocking port 8000

---

**Last Updated:** November 1, 2025
**Version:** Backend 9.2.0
