# 🔐 Password Reset & Recovery Guide

## ✅ I Just Added Password Reset Feature!

You can now **reset passwords** for any user through the Edit User dialog!

### How to Reset a Password:

1. **Login as admin** (username: `admin`, password: `admin123`)
2. Go to **Admin Settings** → **Users** tab
3. Click the **Edit** (pencil icon) button next to any user
4. In the Edit User dialog, you'll now see a **"New Password"** field
5. Enter a new password (or leave empty to keep current password)
6. Click **"Save Changes"**

The password will be updated immediately in both MongoDB and localStorage!

---

## 🔍 How to View Existing Passwords

### Method 1: User Debug Panel (EASIEST!)

1. Login as admin
2. Go to **Admin Settings** → Click hamburger menu (☰) → Select **"User Debug"**
3. Click **"Fetch All Users from Database"**
4. You'll see a table showing ALL users with their passwords visible! 📋

### Method 2: Check Backend Logs

If you have the backend terminal running, user passwords are logged when users are created.

---

## 🎯 For Your "Care" and "Client" Users

**To login with these users:**

1. Use the User Debug Panel to see their passwords, OR
2. Edit them in Admin Settings to set new passwords you know

**Example:**
- Go to Admin → User Debug
- Click "Fetch All Users"
- You'll see:
  - Username: `Care` | Password: `[whatever was set]`
  - Username: `Client` | Password: `[whatever was set]`

Then you can login with those credentials!

---

## 📝 Best Practices

1. **Write down passwords** when creating users
2. Use the **User Debug panel** to check passwords if forgotten
3. Use the **Edit User feature** to reset passwords when needed
4. For security, consider using strong passwords for production

---

## ⚠️ Security Note

The User Debug panel shows passwords in plain text for troubleshooting purposes. In a production environment, you would want to:
- Remove or restrict access to the Debug panel
- Implement password hashing
- Add a "Forgot Password" feature with email reset

But for an internal CRM system, this simple approach works great! 🎉
