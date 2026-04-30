#!/bin/bash

# Synchronize roles and permissions from config to database
# Usage: bash scripts/sync.sh

set -e

echo "🔄 Synchronizing roles and permissions..."
echo "🔄 Sincronizando cargos e permissões..."

php artisan auth:sync-roles-permissions

echo "✅ Roles and permissions synchronized successfully."
echo "✅ Cargo e permissões sincronizados com sucesso."

echo ""
echo "🔄 Synchronizing default categories..."
echo "🔄 Sincronizando categorias padrões..."

php artisan category:sync-defaults

echo "✅ Default categories synchronized successfully."
echo "✅ Categorias padrões sincronizadas com sucesso."
