#!/bin/bash

# Run all seeders (global + module-specific)
# Usage: bash scripts/seed.sh

set -e

echo "🌱 Running global seeders..."
php artisan db:seed

echo "📦 Running Authentication module seeders..."
php artisan db:seed --class="App\Modules\Authentication\Infrastructure\Seeders\AuthenticationSeeder"

echo "✅ All seeders completed."
