#!/bin/bash

echo ""
echo "===================================================================="
echo " BTM TRAVEL CRM - BACKEND SERVER STARTUP"
echo "===================================================================="
echo ""
echo "Starting backend server on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "===================================================================="
echo ""

cd backend
deno run --allow-all server.tsx
