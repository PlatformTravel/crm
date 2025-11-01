#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================================"
echo "  BTM TRAVEL CRM - BACKEND SERVER STARTUP"
echo "========================================================"
echo ""

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo -e "${RED}========================================================${NC}"
    echo -e "${RED}  ERROR: Deno is not installed!${NC}"
    echo -e "${RED}========================================================${NC}"
    echo ""
    echo "Please install Deno from: https://deno.land/"
    echo ""
    echo "Mac/Linux Installation:"
    echo "  curl -fsSL https://deno.land/install.sh | sh"
    echo ""
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}========================================================${NC}"
    echo -e "${RED}  ERROR: Backend directory not found!${NC}"
    echo -e "${RED}========================================================${NC}"
    echo ""
    echo "Please make sure you're running this script from the"
    echo "project root directory."
    echo ""
    exit 1
fi

# Check if server.tsx exists
if [ ! -f "backend/server.tsx" ]; then
    echo -e "${RED}========================================================${NC}"
    echo -e "${RED}  ERROR: backend/server.tsx not found!${NC}"
    echo -e "${RED}========================================================${NC}"
    echo ""
    echo "Please make sure the backend server file exists."
    echo ""
    exit 1
fi

# Kill any existing Deno processes to prevent port conflicts
echo "Checking for running Deno processes..."
if pgrep -x deno > /dev/null; then
    echo -e "${YELLOW}Found existing Deno processes. Terminating...${NC}"
    pkill -9 deno
    sleep 2
    echo -e "${GREEN}Done!${NC}"
fi
echo ""

echo "Starting BTM Travel CRM Backend Server..."
echo ""
echo "========================================================"
echo -e "${YELLOW}  IMPORTANT: Keep this terminal OPEN!${NC}"
echo -e "${YELLOW}  Closing this terminal will stop the backend server.${NC}"
echo "========================================================"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""
echo "--------------------------------------------------------"
echo ""

# Start the backend server
cd backend
deno run --allow-all server.tsx

# This part only runs if the server exits
echo ""
echo "========================================================"
echo "  Backend Server Stopped"
echo "========================================================"
echo ""
