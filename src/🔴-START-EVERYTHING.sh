#!/bin/bash

clear

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🚀 BTM TRAVEL CRM - STARTING BACKEND SERVER"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  This will start the MongoDB backend server."
echo "  Keep this terminal OPEN while using the CRM!"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Kill any existing backend on port 8000
echo "Cleaning up old processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 2

echo ""
echo "Starting backend server on http://localhost:8000"
echo ""
echo "⚠️  IMPORTANT: Keep this terminal OPEN!"
echo ""

cd backend
deno run --allow-net --allow-env --allow-read --allow-write server.tsx
