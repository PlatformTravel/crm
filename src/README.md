# BTM Travel CRM - Customer Management Platform

## 🎮 Now with Automatic Demo Mode!

**NEW:** The app automatically runs in demo mode if the backend isn't started. Try it now with no setup! Login with `admin` / `admin123`

## ✨ Pure MongoDB + Deno (No Supabase!)

A comprehensive CRM and customer management platform for BTMTravel with smart number assignment, 3CX phone integration, and role-based access control.

---

## 🚀 Quick Start

### ⚡ Easiest Way (One Command!)

**Windows:**
```cmd
start-all.bat
```

**Mac/Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### 🔧 Manual Way (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
deno run --allow-net --allow-env server.tsx
```
Wait for: `Listening on http://localhost:8000/`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Login:**
- Username: `admin`
- Password: `admin123`

---

### ⚠️ Getting "Failed to fetch" error?

**You need to start the backend!** See:
- **[⚠️_READ_THIS_FIRST.txt](/⚠️_READ_THIS_FIRST.txt)** ← Start here!
- **[HOW_IT_WORKS.txt](/HOW_IT_WORKS.txt)** - Visual guide
- **[🚀_START_HERE_EASY.md](/🚀_START_HERE_EASY.md)** - Full instructions

**Full documentation:** [QUICK_START.md](/QUICK_START.md)

---

## 🎯 Features

### 📞 CRM & Contact Management
- Daily call lists with scripted prompts
- Automated email notifications
- Call history tracking
- 3CX phone system integration (click-to-call)

### 📊 Smart Number Assignment
- Filter by **Customer Type** (Retails, Corporate, Channel)
- Filter by **Airplane/Flight** for targeted campaigns
- Automatic archiving when assigned
- One-click restore from archive

### 🎁 Promo Sales Management
- Manage promotions across adventure.btmtravel.net
- Campaign tracking
- Promotion history

### 👥 Customer Service
- Existing customer management
- Booking details & contact information
- Interaction history
- Call logging

### 👤 Role-Based Access Control
- **Admin** - Full system access
- **Manager** - Team oversight with granular permissions
- **Agent** - Assigned numbers and customer service

### 📈 Analytics & Reporting
- Daily progress tracking (auto-reset at midnight)
- Team performance overview
- Call analytics
- Login audit trail

---

## 🏗️ Architecture

### Backend
- **Platform:** Pure Deno (No Supabase!)
- **Database:** MongoDB Atlas
- **API:** REST (40+ endpoints)
- **Location:** `/backend/`

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State:** React Context API

### Database
- **MongoDB Atlas** - 11 collections with indexes
- **Collections:** users, numbers_database, assignments, call_logs, and more
- **Features:** Smart filtering, full-text search, aggregation

---

## 📁 Project Structure

```
├── backend/                  ← Pure Deno + MongoDB server
│   ├── server.tsx           ← Main server (40+ endpoints)
│   ├── mongodb.tsx          ← MongoDB utilities
│   ├── deno.json            ← Deno configuration
│   └── README.md            ← Backend docs
│
├── components/              ← React components
│   ├── Login.tsx
│   ├── ClientCRM.tsx
│   ├── CustomerService.tsx
│   ├── PromoSales.tsx
│   ├── ManagerDashboard.tsx
│   ├── AdminSettings.tsx
│   ├── DatabaseManager.tsx
│   └── ...
│
├── utils/
│   ├── config.tsx           ← Backend URL configuration
│   └── backendService.tsx   ← API service layer
│
├── styles/
│   └── globals.css          ← Global styles
│
└── QUICK_START.md           ← Get started in 2 minutes!
```

---

## 🚀 Deployment

### Local Development:
```bash
# Terminal 1: Backend
cd backend && deno run --allow-net --allow-env server.tsx

# Terminal 2: Frontend
npm run dev
```

### Production:

**Deploy backend to:**
- [Deno Deploy](https://deno.com/deploy) (recommended)
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)

**Deploy frontend to:**
- Vercel
- Netlify
- Any static hosting

**Full guide:** [DEPLOY_PURE_MONGODB.md](/DEPLOY_PURE_MONGODB.md)

---

## 🔧 Configuration

### Backend URL
Edit `/utils/config.tsx`:
```tsx
// Development
export const BACKEND_URL = 'http://localhost:8000';

// Production
export const BACKEND_URL = 'https://your-app.deno.dev';
```

### MongoDB Connection
Edit `/backend/mongodb.tsx` (line 17) if needed:
```tsx
const MONGODB_URI = 'mongodb+srv://...';
```

---

## 📊 Database

**MongoDB Atlas:**
- Cluster: cluster0.vlklc6c.mongodb.net
- Database: btm_travel_crm
- Console: https://cloud.mongodb.com

**Collections:**
1. users - User accounts & permissions
2. numbers_database - Numbers with smart filters
3. number_assignments - Assigned numbers
4. call_logs - Call history
5. call_scripts - Agent scripts
6. promotions - Promo campaigns
7. daily_progress - Progress tracking
8. smtp_settings - Email config
9. threecx_settings - Phone config
10. archive - Archived records
11. login_audit - Security logs

---

## 🎨 Key Features in Detail

### Smart Number Assignment
```javascript
// Assign 50 Corporate numbers for flight BA123
POST /database/clients/assign
{
  "agentId": "agent-123",
  "filters": {
    "customerType": "Corporate",
    "airplane": "BA123",
    "count": 50
  }
}
```

### 3CX Phone Integration
- Click-to-call from any number
- Active call panel with controls
- Automatic call logging
- Real-time status updates

### Daily Auto-Reset
- Progress automatically resets at midnight
- Manual reset option available
- Per-user tracking

### Granular Permissions
- Admins can assign specific permissions to managers
- Flexible role system
- Permission inheritance

---

## 🔐 Default Credentials

**Username:** `admin`  
**Password:** `admin123`

⚠️ **Change this immediately after first login!**

---

## 📚 Documentation

- **[QUICK_START.md](/QUICK_START.md)** - Get running in 2 minutes
- **[DEPLOY_PURE_MONGODB.md](/DEPLOY_PURE_MONGODB.md)** - Deployment guide
- **[/backend/README.md](/backend/README.md)** - Backend API documentation
- **[🎉_SUPABASE_COMPLETELY_REMOVED.md](/🎉_SUPABASE_COMPLETELY_REMOVED.md)** - Migration info

---

## 🛠️ Tech Stack

### Backend:
- Deno (TypeScript runtime)
- MongoDB (npm:mongodb@6.3.0)
- Pure HTTP server (no frameworks!)

### Frontend:
- React 18
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Sonner toasts

### Database:
- MongoDB Atlas (M0 free tier compatible)

### Phone System:
- 3CX WebRTC SDK

---

## 📞 Support

**Issues?** Check the documentation files listed above.

**MongoDB Dashboard:** https://cloud.mongodb.com  
**Deno Documentation:** https://deno.land

---

## ✨ What Makes This Special

- ✅ **No Supabase** - Pure Deno + MongoDB
- ✅ **Deploy Anywhere** - Not locked to any platform
- ✅ **Smart Filters** - customerType & airplane assignment
- ✅ **3CX Integration** - Professional phone system
- ✅ **Auto-Reset** - Daily progress tracking
- ✅ **Role-Based** - Flexible permissions
- ✅ **Production-Ready** - MongoDB Atlas scalability

---

## 🎉 Get Started

1. Read [QUICK_START.md](/QUICK_START.md)
2. Start backend and frontend
3. Login with default credentials
4. Change admin password
5. Start building your customer base!

---

**Built with ❤️ for BTM Travel**

*Pure MongoDB. Pure Deno. Pure Power.* 🚀
