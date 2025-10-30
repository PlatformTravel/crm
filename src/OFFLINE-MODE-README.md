# 🔌 BTM Travel CRM - Offline Mode

## ✅ Good News: The App is Working!

You're seeing a "Backend Offline" message, but **the app is fully functional** using **localStorage** (browser storage).

## What is Offline Mode?

Offline Mode means:
- ✅ **Login works** (using browser storage)
- ✅ **All features work** (users, settings, promotions, etc.)
- ✅ **Data is saved locally** in your browser
- ⚠️ **Data is NOT shared** between browsers/devices
- ⚠️ **Data is browser-specific** (clearing browser data = losing data)

## What Works in Offline Mode?

Everything works! Including:

### ✅ User Management
- Create, edit, delete users
- Set roles and permissions
- Manage daily targets

### ✅ Settings
- Email recipients
- Call scripts
- Promotions
- All configuration

### ✅ CRM & Customer Service
- All features work (when implemented)
- Data saved to browser

### ⚠️ What Doesn't Work?
- Data is NOT synced across different browsers/computers
- Data is NOT shared with other team members
- MongoDB features (if you need central database)
- Real-time collaboration

## Default Login Credentials

```
Username: admin
Password: admin123
```

This admin user is automatically created in your browser storage.

## When Should You Use the Backend Server?

You should start the backend server if you need:

1. **Multi-user collaboration** - Share data between team members
2. **Central database** - All data in one place (MongoDB)
3. **Data backup** - Automatic cloud backups
4. **Cross-device access** - Access from any browser/device
5. **Production deployment** - Deploy for your whole team

## How to Start the Backend (Optional)

If you want to use the backend server with MongoDB:

### Step 1: Install Deno

**Mac/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell as Admin):**
```powershell
irm https://deno.land/install.ps1 | iex
```

Or download: https://deno.land/

### Step 2: Start the Server

**Windows:**
```batch
cd backend
deno run --allow-all server.tsx
```

**Mac/Linux:**
```bash
cd backend
deno run --allow-all server.tsx
```

### Step 3: Wait for Confirmation

Wait until you see:
```
🟢 BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅
```

### Step 4: Refresh Browser

Refresh your browser (F5 or Cmd+R)

The app will automatically detect the backend and switch from offline mode!

## Switching Between Modes

### From Offline to Backend:
1. Start the backend server
2. Refresh your browser
3. Data will be migrated automatically

### From Backend to Offline:
1. Stop the backend server
2. Refresh your browser
3. App continues working with localStorage

## Data Storage Locations

### Offline Mode (localStorage):
- Location: Browser storage
- Scope: Current browser only
- Persistence: Until browser cache cleared
- Backup: None (export your data regularly)

### Backend Mode (MongoDB):
- Location: MongoDB Atlas (cloud)
- Scope: All users, all devices
- Persistence: Permanent
- Backup: Automatic cloud backups

## Recommendations

### For Testing/Demo:
✅ **Use Offline Mode** - No setup needed, works immediately

### For Production/Team:
✅ **Use Backend Mode** - Start the server, deploy to cloud

## FAQ

### Q: Is my data safe in offline mode?
A: It's stored in your browser. Don't clear browser data, and export regularly.

### Q: Can I switch back and forth?
A: Yes! The app automatically adapts.

### Q: Will I lose my data?
A: When starting backend mode, your data can be migrated manually.

### Q: Why is offline mode enabled?
A: So you can use the app immediately without complex server setup!

## Summary

🎉 **You can use the BTM Travel CRM right now!**

- No backend setup required
- All features work locally
- Perfect for testing and demos
- Easy upgrade to backend mode later

Just login with **admin** / **admin123** and start using the CRM!

---

For backend setup instructions, see: **START-BACKEND.md**
For troubleshooting, see: **FIXING-LOGIN-ERROR.md**
