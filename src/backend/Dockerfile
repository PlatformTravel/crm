# Use official Deno Alpine image
FROM denoland/deno:alpine

WORKDIR /app

# Copy only source files (NOT .env)
COPY . .

# Cache dependencies
RUN deno cache server.tsx

# Render sets PORT automatically — do not hardcode
EXPOSE 8000

# Start server
CMD ["deno", "run", "--allow-net", "--allow-env",   "--allow-sys=osRelease,systemMemoryInfo", "--allow-read", "server.tsx"]
