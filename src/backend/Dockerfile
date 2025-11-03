# Use the official lightweight Deno image
FROM denoland/deno:alpine

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Cache dependencies (optional)
RUN deno cache server.tsx

# Expose the app port (Render dynamically sets PORT)
EXPOSE 8000

# Run your Deno app
CMD ["run", "--allow-net", "--allow-env", "--allow-sys", "--allow-read", "server.tsx"]

