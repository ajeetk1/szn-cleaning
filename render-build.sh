#!/bin/bash
# This script runs after npm install on Render

echo "Checking if database needs seeding..."

# Only seed if we're on Render and the database should be initialized
if [ "$RENDER" = "true" ]; then
    echo "Running on Render, executing seed script..."
    node seed_render.js
else
    echo "Not running on Render, skipping auto-seed"
fi
