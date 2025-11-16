# Use the official lightweight Deno image
FROM denoland/deno:alpine

# Set working directory
WORKDIR /app

# Copy all backend files (including .env)
COPY . .

# Cache dependencies (optional, improves build time)
RUN deno cache server.tsx

# Expose the app port (Render dynamically sets PORT)
EXPOSE 8000

# Run your Deno app with appropriate permissions
CMD ["deno", "run", "--allow-net", "--allow-env", "--env-file", ".env", "--allow-sys", "--allow-read", "server.tsx"]
