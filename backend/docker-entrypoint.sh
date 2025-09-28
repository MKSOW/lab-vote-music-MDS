#!/usr/bin/env bash
set -e

# Migrations
echo "🚀 Prisma migrate deploy..."
npx prisma migrate deploy

# Démarrage du serveur
echo "✅ Start server"
node src/app.js
