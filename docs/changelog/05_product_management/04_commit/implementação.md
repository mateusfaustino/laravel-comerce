---

## Comando Git para Executar

Copie e cole o comando abaixo no terminal:

```bash
cd c:/dev/PHP/laravel-comerce && git add -A && git commit -m "feat(product-management): implement full ProductManagement DDD module

Add complete product, color, and photo management following DDD patterns.

Backend:
- 7 database migrations (produtos, cores, fotos, variacoes, pivots)
- 4 domain entities, 4 repository interfaces, 4 Eloquent implementations
- 7 DTOs, 13 application services (CRUD + activation + variation validation)
- 4 controllers with Inertia responses, 7 form requests
- Routes with permission-based middleware (list_products, register_product,
  edit_product, delete_product, manage_color)
- SyncDefaultColorsCommand for seeding default colors from config

Frontend:
- Admin sidebar with Produtos, Cores, Fotos navigation groups
- Product pages: paginated list with accordion variations, create with
  category multi-select, show with photos, edit with photo upload +
  variation management dialog
- Cor pages: paginated list with color preview, create/edit with color picker
- Foto pages: product-grouped gallery, upload form

Infra:
- Register ProductManagementServiceProvider in bootstrap/providers.php
- Load routes in bootstrap/app.php
- Add product permissions to ADMIN role
- Update scripts/migrate.sh and scripts/sync.sh
- PSR-12 compliant (pint), production Vite build verified"