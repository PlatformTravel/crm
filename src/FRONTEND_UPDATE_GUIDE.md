# 🔧 Frontend Update Guide - Remove Supabase References

## ✅ What's Fixed

1. **`/utils/backendService.tsx`** - ✅ Updated with all new MongoDB endpoints
2. **`/utils/config.tsx`** - ✅ Points to localhost:8000
3. **`/components/NumberBankManager.tsx`** - ✅ Uses backendService
4. **`/components/DatabaseManager.tsx`** - ✅ Uses backendService

---

## 🔴 Components That Need Updates

The following components still have hardcoded Supabase URLs. They need to be updated to use `backendService`:

### High Priority (Core Functionality):

1. **`/components/ClientCRM.tsx`** (7 Supabase calls)
2. **`/components/CustomerService.tsx`** (9 Supabase calls)
3. **`/components/PromoSales.tsx`** (1 Supabase call)
4. **`/components/UserContext.tsx`** (2 Supabase calls)
5. **`/components/AdminSettings.tsx`** (multiple Supabase calls)

---

## 📝 How to Fix Each Component

### Pattern to Replace:

**OLD (Supabase):**
```tsx
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/endpoint`,
  {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  }
);
```

**NEW (backendService):**
```tsx
import { backendService } from '../utils/backendService';

// Then use the appropriate method
const response = await backendService.methodName(params);
```

---

## 🎯 Available backendService Methods

### Authentication
- `backendService.login(username, password)`
- `backendService.getUsers()`
- `backendService.addUser(user)`
- `backendService.updateUser(userId, updates)`
- `backendService.deleteUser(userId)`

### Numbers Database
- `backendService.getClients()`
- `backendService.importClients(clients)`
- `backendService.assignClients({ clientIds, agentId, filters })`
- `backendService.deleteClient(clientId)`
- `backendService.bulkDeleteClients(ids)`

### Assignments
- `backendService.getAssignments(agentId?)`
- `backendService.claimAssignment(assignmentId, agentId)`
- `backendService.markAssignmentCalled(assignmentId, outcome?)`

### Call Logs
- `backendService.getCallLogs(agentId?)`
- `backendService.addCallLog(callLog)`

### Call Scripts
- `backendService.getCallScripts()`
- `backendService.addCallScript(script)`
- `backendService.activateCallScript(scriptId)`
- `backendService.deleteCallScript(scriptId)`
- `backendService.getActiveCallScript(type)` // 'prospective' | 'existing'

### Daily Progress
- `backendService.getDailyProgress()`
- `backendService.updateDailyProgress(userId, callsToday, lastCallTime?)`
- `backendService.checkDailyReset()`
- `backendService.resetDailyProgress()`

### Promotions
- `backendService.getPromotions()`
- `backendService.addPromotion(promotion)`
- `backendService.updatePromotion(promotionId, updates)`
- `backendService.deletePromotion(promotionId)`

### Settings
- `backendService.getSMTPSettings()`
- `backendService.updateSMTPSettings(settings)`
- `backendService.testSMTP(testEmail)`
- `backendService.get3CXSettings()`
- `backendService.update3CXSettings(settings)`

### Archive
- `backendService.getArchive(type?)`
- `backendService.archiveItem(item)`
- `backendService.restoreFromArchive(archiveId, entityType)`

---

## 🚀 Quick Fix Steps

For each component file:

1. **Add import at top:**
```tsx
import { backendService } from '../utils/backendService';
```

2. **Remove Supabase imports (if present):**
```tsx
// DELETE THESE:
import { projectId, publicAnonKey } from '../utils/supabase/info';
```

3. **Replace fetch calls with backendService calls**

4. **Handle responses:**
```tsx
// backendService returns { success: true, data: ... }
const result = await backendService.getUsers();
if (result.success) {
  setUsers(result.users);
}
```

---

## 🔍 Example: Updating ClientCRM.tsx

### Before:
```tsx
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients/import`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clients: contacts }),
  }
);
const data = await response.json();
```

### After:
```tsx
const data = await backendService.importClients(contacts);
```

---

## ⚠️ Important Notes

### Endpoint Mappings:

Some old endpoints don't exist anymore. Here are the mappings:

| Old Endpoint | New backendService Method |
|--------------|---------------------------|
| `/prospective-contacts` | Not used - use `/database/clients` |
| `/admin/settings` | `getUsers()` (users are the settings now) |
| `/admin/set-global-target` | Per-user targets now |
| `/customers/assigned/:agentId` | `getAssignments(agentId)` |
| `/send-email` | Not implemented yet |
| `/send-quick-email` | Not implemented yet |
| `/customer-interactions` | Not implemented yet |

### Missing Endpoints:

These endpoints from the old system aren't in the new backend yet:
- Email sending endpoints
- Customer interactions
- Some archive endpoints

**Solution:** These will need to be added to `/backend/server.tsx` if needed.

---

## 🎯 Priority Update Order

1. **AdminSettings.tsx** - Core admin functionality
2. **UserContext.tsx** - Daily progress tracking
3. **ClientCRM.tsx** - Main CRM functionality
4. **CustomerService.tsx** - Customer management
5. **PromoSales.tsx** - Promotions

---

## ✅ Testing After Updates

After updating each component:

1. Start backend: `cd backend && deno run --allow-net --allow-env server.tsx`
2. Start frontend: `npm run dev`
3. Test the component functionality
4. Check browser console for errors
5. Check backend terminal for request logs

---

## 🆘 If You Get Errors

### "Method not found on backendService"
- Check the available methods list above
- The endpoint might not exist in the new backend
- You may need to add it to `/backend/server.tsx`

### "Server responded with 404"
- The endpoint doesn't exist in the new backend
- Check `/backend/server.tsx` to see available endpoints
- You may need to implement the endpoint

### "Cannot read property of undefined"
- Response structure might be different
- Old: `response.json()`
- New: `backendService returns data directly`

---

## 💡 Need Help?

The backend logs all requests. When testing:

```bash
# Terminal 1: Backend
cd backend
deno run --allow-net --allow-env server.tsx

# You'll see:
[BTM CRM Server] [GET] /users
[MongoDB] ✅ Connected successfully
```

This helps debug which endpoints are being called!

---

**Once all components are updated, your frontend will be completely Supabase-free!** 🎉
