#!/bin/bash

echo "=================================="
echo "CORS Configuration Test"
echo "=================================="
echo ""

# Test if backend is running
echo "Testing backend connection..."
response=$(curl -s -w "\n%{http_code}" http://localhost:8000/health 2>/dev/null)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
    echo "✅ Backend is running on port 8000"
else
    echo "❌ Backend is not running. Please start it first."
    echo "   Run: ./start.sh or deno run --allow-all server.tsx"
    exit 1
fi

echo ""
echo "Testing CORS configuration..."
echo ""

# Test CORS headers with OPTIONS request
cors_response=$(curl -s -X OPTIONS -I http://localhost:8000/health 2>/dev/null)

echo "CORS Headers Found:"
echo "-------------------"

# Check each CORS header
if echo "$cors_response" | grep -i "access-control-allow-origin" > /dev/null; then
    echo "✅ Access-Control-Allow-Origin: Found"
else
    echo "❌ Access-Control-Allow-Origin: Missing"
fi

if echo "$cors_response" | grep -i "access-control-allow-methods" > /dev/null; then
    echo "✅ Access-Control-Allow-Methods: Found"
else
    echo "❌ Access-Control-Allow-Methods: Missing"
fi

if echo "$cors_response" | grep -i "access-control-allow-headers" > /dev/null; then
    echo "✅ Access-Control-Allow-Headers: Found"
else
    echo "❌ Access-Control-Allow-Headers: Missing"
fi

if echo "$cors_response" | grep -i "access-control-expose-headers" > /dev/null; then
    echo "✅ Access-Control-Expose-Headers: Found"
else
    echo "⚠️  Access-Control-Expose-Headers: Missing (optional)"
fi

if echo "$cors_response" | grep -i "access-control-max-age" > /dev/null; then
    echo "✅ Access-Control-Max-Age: Found"
else
    echo "⚠️  Access-Control-Max-Age: Missing (optional)"
fi

echo ""
echo "Getting detailed CORS configuration..."
curl -s http://localhost:8000/debug/cors | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/debug/cors

echo ""
echo "=================================="
echo "CORS Test Complete"
echo "=================================="
