# ⚡ START THE BACKEND SERVER FIRST!

## ⚠️ IMPORTANT: The backend server MUST be running for the CRM to work!

### 🪟 Windows Users:
**Double-click this file:**
```
🔴-START-BACKEND-FIXED.bat
```

### 🍎 Mac/Linux Users:
**Run in terminal:**
```bash
chmod +x 🔴-START-BACKEND-FIXED.sh
./🔴-START-BACKEND-FIXED.sh
```

### ⚙️ Manual Start (Alternative):
```bash
cd backend
deno run --allow-all server.tsx
```

---

## ✅ How to know it's working:

You should see in the terminal:
```
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
🟢                                                         🟢
🟢  BTM TRAVEL CRM SERVER - FULLY OPERATIONAL! ✅          🟢
🟢  VERSION: 9.2.0 - CALL TRACKER INTEGRATED!             🟢
🟢                                                         🟢
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢

[MongoDB] ✅ Connected successfully and verified
🚀 Server running on http://localhost:8000
```

---

## ⚠️ Common Issues:

### Error: "Cannot connect to backend server"
**Solution:** Start the backend server using one of the methods above

### Error: "Port 8000 already in use"
**Solution:** Close any other terminal windows running the backend, or restart your computer

### Error: "Deno not found"
**Solution:** Install Deno from https://deno.land/

---

## 📝 Remember:
- **Keep the terminal/command window OPEN** while using the CRM
- Closing it will stop the backend
- You need to start it every time you use the CRM
- One backend serves all browser tabs/users

---

For detailed setup instructions, see: `QUICK-START.md`
