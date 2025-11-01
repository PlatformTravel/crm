# 🚀 BTMTravel CRM - Quick Start Guide

Welcome to the BTMTravel CRM and Customer Management Platform! This guide will help you get started quickly.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Backend Server

**Windows Users:**
```bash
# Double-click this file in your project folder:
🔴-START-BACKEND-FIXED.bat

# Or run in Command Prompt:
cd backend
deno run --allow-all server.tsx
```

**Mac/Linux Users:**
```bash
# Make executable and run:
chmod +x 🔴-START-BACKEND-FIXED.sh
./🔴-START-BACKEND-FIXED.sh

# Or run manually:
cd backend
deno run --allow-all server.tsx
```

### Step 2: Start the Frontend

```bash
# In a new terminal window:
npm run dev
```

### Step 3: Login

Open your browser to `http://localhost:5173` and login with:

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

**Default Agent Accounts:**
- Username: `agent1` / Password: `agent123`
- Username: `care` / Password: `care123`
- Username: `client` / Password: `client123`

---

## 📖 System Overview

### Three Main Tabs

1. **Prospective Client (CRM)** 
   - Contact management
   - Phone number database
   - Click-to-call with 3CX integration
   - Call logging and tracking

2. **Promo Sales**
   - Promotion management
   - Campaign tracking
   - Analytics and metrics
   - Customer targeting

3. **Customer Service**
   - Customer management
   - Service requests
   - Purchase history
   - Support tickets

### User Roles

- **Admin** - Full system access, user management, settings
- **Manager** - Team oversight, performance monitoring, data management
- **Agent** - Daily operations, customer interaction, call handling

---

## 🔧 Key Features

### Database Management
- **Centralized Database** - Single source of truth in MongoDB
- **Number Bank** - Managers push numbers to agents daily
- **Special Database** - CSV import for specific campaigns
- **Archive System** - Complete data archiving with restore capability

### 3CX Phone Integration
- Click-to-call functionality
- Automatic call logging
- Real-time call tracking
- Call completion metrics

### Offline Mode
- Automatic localStorage fallback
- Works without backend connection
- Syncs when connection restored
- No data loss

---

## 📂 Important Files

### Essential Documentation
- `README.md` - Complete system documentation
- `QUICK-START.md` - This file
- `SINGLE-DATABASE-SYSTEM.md` - Database architecture
- `SPECIAL-DATABASE-SYSTEM.md` - Special database features
- `Attributions.md` - Third-party credits

### Startup Scripts
- `🔴-START-BACKEND-FIXED.bat/sh` - **Recommended** backend startup
- `🔴-START-EVERYTHING.bat/sh` - Start backend + frontend together
- `backend/start.bat/sh` - Basic backend startup

---

## 🛠️ Configuration

### MongoDB Setup
The system uses MongoDB Atlas. Connection string is configured in:
```
backend/mongodb.tsx
```

Default connection: MongoDB Atlas cloud database

### 3CX Integration
Configure in Admin Settings → 3CX Settings:
- Server URL
- Extension
- API credentials
- Click-to-call settings

### Email Settings
Configure in Admin Settings → SMTP Settings:
- SMTP server details
- Email recipients for reports
- Notification preferences

---

## 🚨 Troubleshooting

### Backend Not Connected
**Symptom:** Blue "Offline Mode" banner appears

**Solution:**
1. Check if backend server is running (look for terminal with "MongoDB connected")
2. Wait 10-30 seconds for MongoDB to initialize
3. Click "Retry Connection" button
4. If still offline, restart backend using startup scripts

### Login Issues
**Symptom:** "Invalid credentials" error

**Solution:**
1. Use default credentials listed above
2. Check caps lock is off
3. Try admin/admin123 for admin access
4. Contact administrator for password reset if needed

### Numbers Not Available
**Symptom:** "No numbers available" when trying to call

**Solution:**
1. Manager must push numbers to Number Bank first
2. Go to Manager Portal → Database Manager
3. Add numbers or import CSV
4. Assign numbers to agents

### Grace Period Messages
**Normal behavior:** System waits 3 seconds on startup before checking backend
- This prevents alarming error messages
- Allow MongoDB time to initialize
- Creates smooth user experience

---

## 📱 Phone Number Format

All Nigerian numbers use format: `+234 XXX XXX XXXX`

Example: `+234 803 123 4567`

---

## 💾 Data Storage

### Production Mode (MongoDB)
- All data stored in MongoDB Atlas
- Multi-user synchronization
- Real-time updates
- Persistent across sessions

### Offline Mode (localStorage)
- Automatic fallback when backend unavailable
- Local browser storage only
- Single-user mode
- Syncs when backend reconnects

---

## 🎓 Admin Quick Tasks

### Create New User
1. Login as admin
2. Go to Admin Settings → User Management
3. Click "Add User"
4. Fill in details and assign role
5. Set permissions and daily targets

### Push Numbers to Agents
1. Login as manager/admin
2. Go to Manager Portal → Database Manager
3. Import CSV or add numbers manually
4. Numbers appear in agents' Number Bank

### View Performance
1. Login as manager/admin
2. Go to Manager Portal → Team Performance
3. View metrics, call history, and analytics
4. Export reports as needed

---

## 🔐 Security Notes

- Change default passwords immediately
- This system is for internal use only
- Do not collect PII or sensitive data
- Regular backups recommended
- Keep MongoDB credentials secure

---

## 📞 System Requirements

- **Node.js** 16+ (for frontend)
- **Deno** 1.40+ (for backend)
- **MongoDB Atlas** account (cloud database)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for MongoDB sync)

---

## 🎉 You're Ready!

Your BTMTravel CRM is now set up and ready to use. Start by:

1. ✅ Starting the backend server
2. ✅ Logging in as admin
3. ✅ Creating user accounts for your team
4. ✅ Configuring 3CX settings (if using)
5. ✅ Importing your contact database
6. ✅ Assigning numbers to agents

**Need help?** Check the detailed documentation in `README.md` or contact your system administrator.

---

**Version:** 2.0  
**Last Updated:** November 1, 2025  
**Platform:** BTMTravel CRM & Customer Management
