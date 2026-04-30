#!/bin/bash

# Run all migrations (global + module-specific)
# Usage: bash scripts/migrate.sh          (run migrations)
# Usage: bash scripts/migrate.sh --fresh  (fresh migrate)
# Usage: bash scripts/migrate.sh --rollback (rollback last batch)

set -e

echo "🚀 Running global migrations..."
echo "🚀 Rodando migrations globais..."
php artisan migrate ${1:-} --path=database/migrations

echo "📦 Running Authentication module migrations..."
echo "📦 Rodando migrations do módulo Authentication..."
php artisan migrate ${1:-} --path=app/Modules/Authentication/Infrastructure/Persistence/Migrations

echo "📦 Running CategoryManagement module migrations..."
echo "📦 Rodando migrations do módulo CategoryManagement..."
php artisan migrate ${1:-} --path=app/Modules/CategoryManagement/Infrastructure/Persistence/Migrations

echo "✅ All migrations completed."
echo "✅ Todas as migrations foram concluídas."

