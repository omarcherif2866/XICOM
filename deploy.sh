#!/bin/bash
set -e

# Configuration
PROJECT_DIR="$(pwd)"
ENV_FILE=".env"

echo "🚀 Starting deployment of XICOM project..."

# 1. Update code (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# 2. Ensure .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  $ENV_FILE not found! Creating from template..."
    cat <<EOF > .env
MYSQL_DATABASE=xicom_db
MYSQL_ROOT_PASSWORD=$(openssl rand -hex 12)
MYSQL_USER=xicom_user
MYSQL_PASSWORD=$(openssl rand -hex 12)
JWT_SECRET=$(openssl rand -hex 24)
CLOUDINARY_URL=
EOF
    echo "✅ Created .env with random passwords. Please edit it if needed."
fi

# 3. Build and Restart Containers
echo "Building and starting containers..."
sudo docker compose down
sudo docker compose up -d --build

# 4. Cleanup
echo "🧹 Cleaning up unused Docker images..."
sudo docker image prune -f

echo "✅ Deployment finished successfully!"
echo "📍 Application should be live at http://localhost (or your VPS IP)"
echo "📡 Service status:"
sudo docker compose ps
