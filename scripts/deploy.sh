#!/bin/bash

# Production deployment script - run after every site update
# Usage: bash scripts/deploy.sh
#
# This script performs all necessary steps to apply an update in production:
# 1. Put the application in maintenance mode
# 2. Install/update PHP dependencies
# 3. Run database migrations
# 4. Synchronize roles, permissions, categories and colors
# 5. Clear and cache config, routes and views
# 6. Build frontend assets
# 7. Ensure storage symlink exists
# 8. Bring the application back online

# set -e

# echo "🚀 Starting production deployment..."
# echo "🚀 Iniciando deploy em produção..."
# echo ""

# # -------------------------------------------------------
# # 1. Enable maintenance mode
# # -------------------------------------------------------
# echo "🔧 Enabling maintenance mode..."
# echo "🔧 Ativando modo de manutenção..."
# php artisan down --render="errors::503" --retry=60
# echo ""

# # -------------------------------------------------------
# # 2. PHP dependencies
# # -------------------------------------------------------
# echo "📦 Installing PHP dependencies (no-dev)..."
# echo "📦 Instalando dependências PHP (no-dev)..."
# composer install --no-dev --optimize-autoloader --no-interaction
# echo ""

# -------------------------------------------------------
# 0. git pull
# -------------------------------------------------------
echo "🗃️ Git pull"
echo "🗃️ Rodando git pull..."
bash git pull origin master
echo ""

# -------------------------------------------------------
# 3. Database migrations
# -------------------------------------------------------
echo "🗃️ Running database migrations..."
echo "🗃️ Rodando migrations do banco de dados..."
bash scripts/migrate.sh
echo ""

# -------------------------------------------------------
# 4. Synchronize data (roles, permissions, categories, colors)
# -------------------------------------------------------
echo "🔄 Synchronizing system data..."
echo "🔄 Sincronizando dados do sistema..."
bash scripts/sync.sh
echo ""

# -------------------------------------------------------
# 5. Clear and rebuild caches
# -------------------------------------------------------
echo "🧹 Clearing application caches..."
echo "🧹 Limpando caches da aplicação..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
echo ""

echo "⚡ Caching config and routes for performance..."
echo "⚡ Cacheando configuração e rotas para performance..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
echo ""

# -------------------------------------------------------
# 6. Frontend assets
# -------------------------------------------------------
echo "🏗️ Building frontend assets..."
echo "🏗️ Compilando assets do frontend..."

npm run build
echo ""

# -------------------------------------------------------
# 7. Storage symlink
# -------------------------------------------------------
echo "🔗 Ensuring storage symlink exists..."
echo "🔗 Garantindo que o symlink de storage existe..."
php artisan storage:link
echo ""

# # -------------------------------------------------------
# # 8. Disable maintenance mode
# # -------------------------------------------------------
# echo "✅ Bringing application back online..."
# echo "✅ Retornando a aplicação ao ar..."
# php artisan up
# echo ""

echo "🎉 Deployment completed successfully!"
echo "🎉 Deploy concluído com sucesso!"
