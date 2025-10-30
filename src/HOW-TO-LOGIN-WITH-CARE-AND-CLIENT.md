# 🔑 How to Login with "Care" and "Client" Users

## The Problem

You can see "Care" (agent) and "Client" (manager) users in the System Users list (from MongoDB), but you can't login because **you don't know their passwords**.

When these users were created, passwords were set but they're not visible in the UI.

## Solution 1: Use the User Debug Panel (EASIEST!)

1. **Login as admin** (username: `admin`, password: `admin123`)
2. Go to **Admin Settings** → Click hamburger menu → Select **"User Debug"**
3. Click **"Fetch All Users from Database"**
4. You'll see a table showing ALL users INCLUDING their passwords! 📋

The passwords are shown in plain text in the debug panel.

## Solution 2: Reset Their Passwords

I'm adding a password reset feature to the Edit User dialog right now...

## Solution 3: Check Backend Logs

If you have the backend terminal open, check the logs when these users were created - the passwords were logged there.

## Solution 4: Use UserDebugPanel to Test Login

In the User Debug Panel:
1. Enter username: `Care`
2. Try common passwords: `Care123`, `care123`, `password`, etc.
3. Click "Test Login" - it will tell you if the password is correct!

## For Future Reference

When creating users via Admin panel, **write down their passwords immediately** as there's currently no "Forgot Password" feature (since this is an internal CRM system).

---

**Quick Tip:** Go to User Debug panel and click "Fetch All Users" - you'll see all passwords! 🎯
