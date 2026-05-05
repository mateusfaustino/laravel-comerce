# Implementação — Módulo Storefront

## Resumo
Criação do módulo Storefront como um bounded context DDD separado, substituindo as páginas de vitrine mocadas (home e product detail) por dados reais do banco de dados, acessados via interfaces dos módulos ProductManagement e CategoryManagement.

## Decisão Arquitetural
O Storefront é um módulo **somente leitura** — ele consulta dados de outros módulos através de suas interfaces públicas de repositório, mas não possui entidades de domínio próprio nem tabelas de banco de dados. Isso segue o princípio de Contexto Delimitado do DDD: o Storefront tem sua própria visão dos dados de Produto/Categoria, adaptada para a vitrine pública.

## Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `app/Modules/Storefront/Application/DTOs/StorefrontCategoryDTO.php` | DTO para exibição de categorias na vitrine |
| `app/Modules/Storefront/Application/DTOs/StorefrontProductDTO.php` | DTO para cards de produtos na vitrine |
| `app/Modules/Storefront/Application/DTOs/StorefrontProductDetailDTO.php` | DTO para página de detalhe do produto |
| `app/Modules/Storefront/Application/Services/ListStorefrontHomeService.php` | Serviço de aplicação para dados da homepage |
| `app/Modules/Storefront/Application/Services/GetStorefrontProductService.php` | Serviço de aplicação para detalhe do produto |
| `app/Modules/Storefront/Infrastructure/Providers/StorefrontServiceProvider.php` | Provider do módulo (registra rotas) |
| `app/Modules/Storefront/Presentation/Http/Controllers/StorefrontController.php` | Controller com actions `home()` e `show()` |
| `app/Modules/Storefront/Presentation/Http/routes.php` | Rotas públicas `/` e `/produto/{slug}` |

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `bootstrap/providers.php` | Adicionado `StorefrontServiceProvider` |
| `routes/web.php` | Removidas rotas mocadas `/` e `/produto/{id}` |
| `resources/js/pages/store-homepage.tsx` | Substituídos dados mocados por props Inertia |
| `resources/js/pages/product-page.tsx` | Substituídos dados mocados por props Inertia, usa slug ao invés de ID |
| `resources/js/components/store/product-card.tsx` | Interface atualizada para DTO do backend |
| `resources/js/components/store/category-card.tsx` | Interface atualizada para DTO do backend |
| `app/Modules/ProductManagement/Domain/Repositories/ProductRepositoryInterface.php` | Adicionados métodos `findByCategoryId()`, `findRecent()`, `findWithThumbnail()` |
| `app/Modules/ProductManagement/Infrastructure/Persistence/Repositories/EloquentProductRepository.php` | Implementação dos 3 novos métodos |

## Rotas

| Método | URI | Nome | Descrição |
|--------|-----|------|-----------|
| GET | `/` | `home` | Página inicial da vitrine |
| GET | `/produto/{slug}` | `product.show` | Detalhe do produto (usa slug) |

## Mapeamento de Dados Mock → Real

| Campo Mock | Campo Real (DTO) | Origem |
|------------|------------------|--------|
| `name` | `nome` | Product entity |
| `price` (number) | `price` (string, decimal) | Variation `preco_venda` |
| `promotionalPrice` (number) | `promotionalPrice` (string, decimal) | Variation `preco_promocional` |
| `image` (static path) | `image` (Storage URL) | Foto entity + Storage::url() |
| `category` | `categoryName` | Product category names |
| `isFeatured` (flag) | `isFeatured` | Product has `thumbnail_foto_id` |
| `isNew` (flag) | `isNew` | Determinado por ser produto recente |
| `colors` (hex array) | `colors` | Variation `cor_cod_rgb` únicos |
| `sizes` (string array) | `sizes` | Variation tamanho fields únicos |

## Comando de Commit

```bash
git add -A && git commit -m "feat(storefront): create Storefront module replacing mock data with real database queries

- Create Storefront DDD module with Application/Infrastructure/Presentation layers
- Add ListStorefrontHomeService for homepage data (categories, featured, new arrivals, products by category)
- Add GetStorefrontProductService for product detail page with similar products
- Add StorefrontController with home() and show() actions using slug-based URLs
- Add StorefrontServiceProvider for route registration
- Add StorefrontCategoryDTO, StorefrontProductDTO, StorefrontProductDetailDTO
- Extend ProductRepositoryInterface with findByCategoryId(), findRecent(), findWithThumbnail()
- Implement new repository methods in EloquentProductRepository
- Update store-homepage.tsx to use Inertia props instead of mock data
- Update product-page.tsx to use Inertia props and slug-based routing
- Update product-card.tsx and category-card.tsx interfaces to match DTO shapes
- Remove mock routes from routes/web.php
- Register StorefrontServiceProvider in bootstrap/providers.php"
```

## Comandos de Deploy

```bash
# Nenhuma migration nova é necessária

# Limpar cache de rotas
php artisan route:clear

# Limpar cache de configuração
php artisan config:clear

# Limpar cache de views
php artisan view:clear

# Rebuild dos assets frontend
npm run build

# Garantir que o symlink de storage existe
php artisan storage:link
```
