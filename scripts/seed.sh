#!/bin/bash

# Run all seeders (global + module-specific)
# Usage: bash scripts/seed.sh

set -e

echo "🌱 Running global seeders..."
echo "🌱 Rodando seeders globais..."
php artisan db:seed

echo "📦 Running Authentication module seeders..."
echo "📦 Rodando seeders do módulo Authentication..."
php artisan db:seed --class="App\Modules\Authentication\Infrastructure\Persistence\Seeders\AuthenticationSeeder"

echo "✅ All seeders completed."
echo "✅ Todas as seeders foram concluídas."
