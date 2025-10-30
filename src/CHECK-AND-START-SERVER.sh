#!/bin/bash

echo "========================================"
echo "BTM TRAVEL CRM - SERVER CHECKER"
echo "========================================"
echo ""

echo "Checking if backend server is running..."
echo ""

# Try to ping the health endpoint
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ GOOD NEWS: Backend server is RUNNING!"
    echo ""
    curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
    echo ""
    echo ""
    echo "If your frontend still shows errors, try:"
    echo "1. Refresh your browser (Cmd+Shift+R or Ctrl+F5)"
    echo "2. Clear browser cache"
    echo "3. Check browser console for errors"
    echo ""
else
    echo "❌ Backend server is NOT running!"
    echo ""
    echo "Starting the backend server now..."
    echo ""
    echo "⚠️  IMPORTANT: Keep this terminal open!"
    echo "   Closing this terminal will stop the server."
    echo ""
    echo "Press Ctrl+C to stop the server when done."
    echo ""
    echo "========================================"
    echo ""
    
    # Check if Deno is installed
    if ! command -v deno &> /dev/null; then
        echo "❌ ERROR: Deno is not installed!"
        echo ""
        echo "Please install Deno first:"
        echo ""
        echo "Run this command:"
        echo "  curl -fsSL https://deno.land/install.sh | sh"
        echo ""
        echo "Then add Deno to your PATH and restart this script."
        echo ""
        exit 1
    fi
    
    cd backend
    echo "Starting server with Deno..."
    echo ""
    deno run --allow-all server.tsx
fi
