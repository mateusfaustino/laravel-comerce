#!/bin/bash

# Synchronize roles and permissions from config to database
# Usage: bash scripts/sync.sh

set -e

echo "🔄 Synchronizing roles and permissions..."
echo "🔄 Sincronizando cargos e permissões..."

php artisan auth:sync-roles-permissions

echo "✅ Roles and permissions synchronized successfully."
echo "✅ Cargo e permissões sincronizados com sucesso."
