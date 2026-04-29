#!/bin/bash

# Run all migrations (global + module-specific)
# Usage: bash scripts/migrate.sh          (run migrations)
# Usage: bash scripts/migrate.sh --fresh  (fresh migrate)
# Usage: bash scripts/migrate.sh --rollback (rollback last batch)

set -e

echo "🚀 Running global migrations..."
php artisan migrate ${1:-} --path=database/migrations

echo "📦 Running Authentication module migrations..."
php artisan migrate ${1:-} --path=app/Modules/Authentication/Infrastructure/Persistence/Migrations

echo "✅ All migrations completed."
