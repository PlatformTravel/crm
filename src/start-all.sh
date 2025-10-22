#!/bin/bash

# BTM Travel CRM - Start Everything
# This script starts both frontend and backend together

echo "========================================"
echo "  🚀 BTM Travel CRM - Starting All"
echo "========================================"
echo ""

# Check if Deno is installed
if ! command -v deno &> /dev/null
then
    echo "❌ Deno is not installed!"
    echo ""
    echo "📥 Install Deno first:"
    echo ""
    echo "Windows (PowerShell):"
    echo "  irm https://deno.land/install.ps1 | iex"
    echo ""
    echo "Mac/Linux:"
    echo "  curl -fsSL https://deno.land/install.sh | sh"
    echo ""
    exit 1
fi

echo "✅ Deno installed: $(deno --version | head -n 1)"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting Backend Server..."
cd backend
deno run --allow-net --allow-env server.tsx &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "⚠️  Backend might still be starting..."
fi

echo ""
echo "🎨 Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  ✅ Both servers are starting!"
echo "========================================"
echo ""
echo "📊 Backend:  http://localhost:8000"
echo "🖥️  Frontend: http://localhost:3000 (or your dev port)"
echo ""
echo "🔐 Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "========================================"
echo ""

# Wait for both processes
wait
