#!/bin/bash

echo "🚀 Starting BTM Travel CRM Backend..."
echo "📊 MongoDB: btm_travel_crm @ cluster0.vlklc6c.mongodb.net"
echo "🌐 Server: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

deno run --allow-net --allow-env server.tsx
