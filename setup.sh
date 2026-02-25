#!/usr/bin/env bash
set -e

# Initialize frontend
cd frontend
npm install
cd ..

# Start docker compose
docker compose up --build -d

echo "Setup complete. Frontend on http://localhost:3000, backend on http://localhost:8000"
