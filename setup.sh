#!/usr/bin/env bash
set -e

# Initialize frontend
cd frontend
npm install
cd ..

# Start docker compose
docker compose -f deploy/docker-compose.yml up --build -d

echo "Setup complete. Frontend on http://localhost:3000, backend on http://localhost:8000"
