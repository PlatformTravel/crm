# BTM Travel CRM Backend - Pure MongoDB + Deno

## 🚀 No Supabase! Just MongoDB + Deno!

This is your backend server for the BTM Travel CRM. It's a pure Deno application with MongoDB Atlas, completely independent of Supabase.

---

## 📁 Files

- **`server.tsx`** - Main Deno server with 40+ REST API endpoints
- **`mongodb.tsx`** - MongoDB connection utilities and helpers
- **`deno.json`** - Deno configuration with MongoDB dependency

---

## 🏃 Quick Start

### Run Locally:
```bash
deno run --allow-net --allow-env server.tsx
```

Server will start on **http://localhost:8000**

### Run with Auto-Reload (Development):
```bash
deno run --allow-net --allow-env --watch server.tsx
```

### Using deno.json tasks:
```bash
deno task start  # Production
deno task dev    # Development with watch mode
```

---

## ✅ Test the Server

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "BTM Travel CRM Server is running (MongoDB)",
  "version": "3.0.0-mongodb-standalone"
}
```

---

## 🗄️ MongoDB Connection

**Database:** `btm_travel_crm`  
**Cluster:** `cluster0.vlklc6c.mongodb.net`  
**Connection:** Hardcoded in `mongodb.tsx` (line 17)

**To change the connection string:**
Edit `mongodb.tsx` line 17:
```tsx
const MONGODB_URI = 'mongodb+srv://...';
```

---

## 📊 Collections (11 total)

1. **users** - User accounts & permissions
2. **numbers_database** - Numbers with customerType & airplane filters
3. **number_assignments** - Assigned numbers to agents
4. **call_logs** - Call history & analytics
5. **call_scripts** - Agent call scripts
6. **promotions** - Promotional campaigns
7. **daily_progress** - Daily call tracking
8. **smtp_settings** - Email configuration
9. **threecx_settings** - Phone system configuration
10. **archive** - Archived records
11. **login_audit** - Login attempt logs

---

## 🔌 API Endpoints

### Health
- `GET /health` - Server health check
- `GET /test` - Test endpoint

### Authentication
- `POST /users/login` - User login
- `GET /login-audit` - Login history

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Numbers Database (with Smart Filters!)
- `GET /database/clients` - Get available numbers
- `POST /database/clients/import` - Upload numbers
- `POST /database/clients/assign` - Assign numbers (filter by customerType & airplane!)
- `DELETE /database/clients/:id` - Delete number
- `POST /database/clients/bulk-delete` - Bulk delete

### Number Assignments
- `GET /assignments?agentId=xxx` - Get assignments for agent
- `POST /assignments/claim` - Claim assignment
- `POST /assignments/mark-called` - Mark assignment as called

### Call Logs
- `GET /call-logs?agentId=xxx` - Get call logs
- `POST /call-logs` - Create call log

### Daily Progress
- `GET /daily-progress` - Get daily progress
- `POST /daily-progress` - Update progress
- `GET /daily-progress/check-reset` - Check for auto-reset
- `POST /daily-progress/reset` - Manual reset

### Call Scripts
- `GET /call-scripts` - Get all scripts
- `POST /call-scripts` - Create script
- `POST /call-scripts/:id/activate` - Activate script
- `DELETE /call-scripts/:id` - Delete script
- `GET /call-scripts/active/:type` - Get active script (prospective/existing)

### Promotions
- `GET /promotions` - Get all promotions
- `POST /promotions` - Create promotion
- `PUT /promotions/:id` - Update promotion
- `DELETE /promotions/:id` - Delete promotion

### Settings
- `GET /smtp-settings` - Get SMTP settings
- `POST /smtp-settings` - Update SMTP settings
- `POST /smtp-test` - Test SMTP connection
- `GET /threecx-settings` - Get 3CX settings
- `POST /threecx-settings` - Update 3CX settings

### Archive
- `GET /archive?type=xxx` - Get archived items
- `POST /archive` - Archive an item
- `POST /archive/restore` - Restore from archive

---

## 🎯 Smart Number Assignment Example

Assign 50 Corporate numbers for flight BA123:

```bash
curl -X POST http://localhost:8000/database/clients/assign \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-123",
    "filters": {
      "customerType": "Corporate",
      "airplane": "BA123",
      "count": 50
    }
  }'
```

---

## 🚀 Deploy to Production

### Deno Deploy (Recommended):
```bash
deployctl deploy --project=btm-travel-crm server.tsx
```

### Railway:
```bash
railway up
```

### Render:
- Point to `/backend/server.tsx`
- Build: `deno cache server.tsx`
- Start: `deno run --allow-net --allow-env server.tsx`

### Fly.io:
```bash
flyctl launch
flyctl deploy
```

**After deployment, update `/utils/config.tsx` in frontend with your deployed URL!**

---

## 🔧 Environment

**Required Permissions:**
- `--allow-net` - Network access (HTTP server, MongoDB connection)
- `--allow-env` - Environment variables (optional, for future use)

**No environment variables required!** MongoDB URI is hardcoded.

---

## 📝 Default Admin Account

On first connection, the server creates:

**Username:** admin  
**Password:** admin123  
**Role:** admin  

⚠️ **Change this password immediately after deployment!**

---

## 🔍 Logging

The server logs all requests:
```
[BTM CRM Server] [GET] /health
[MongoDB] Connecting to database...
[MongoDB] ✅ Connected successfully
[MongoDB] Initializing database...
[MongoDB] ✅ Indexes created successfully
```

---

## ✨ Features

- ✅ **Pure Deno** - No Supabase, no frameworks
- ✅ **MongoDB Atlas** - Production-ready database
- ✅ **Smart Filtering** - Filter by customerType & airplane
- ✅ **Auto-Reset** - Daily progress resets at midnight
- ✅ **Indexes** - Optimized queries
- ✅ **CORS Enabled** - Works with any frontend
- ✅ **Error Handling** - Comprehensive error responses

---

## 🎉 You're Independent!

This server is completely independent and can be deployed anywhere that supports Deno:
- Deno Deploy
- Railway
- Render  
- Fly.io
- DigitalOcean
- AWS
- Google Cloud
- Azure
- Your own server

**No vendor lock-in!**

---

**🚀 Happy deploying!**
