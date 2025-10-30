#!/bin/bash

echo "========================================"
echo "COUNTER RESET DIAGNOSTIC TEST"
echo "========================================"
echo ""

echo "[1/3] Testing if backend server is running..."
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ Backend server is NOT running!"
    echo ""
    echo "Please start the backend server first:"
    echo "   cd backend"
    echo "   deno run --allow-all server.tsx"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi
echo "✅ Backend server is running"

echo ""
echo "[2/3] Checking server version and reset endpoint..."
curl -s http://localhost:8000/test
echo ""

echo ""
echo "[3/3] Testing counter reset endpoint..."
echo "Sending reset request with all options enabled..."
curl -X POST http://localhost:8000/reset-all-counters \
  -H "Content-Type: application/json" \
  -d '{"resetDailyProgress":true,"resetCallLogs":false,"resetNumberClaims":true,"resetAssignmentCounters":true}'

echo ""
echo ""
echo "========================================"
echo "DIAGNOSTIC COMPLETE"
echo "========================================"
echo ""
echo "If you see \"success\": true above, the reset worked!"
echo ""
echo "If you see an error:"
echo "  - Make sure the backend server is running"
echo "  - Try restarting the backend server"
echo "  - Check the backend console for error messages"
echo ""
read -p "Press Enter to exit..."
