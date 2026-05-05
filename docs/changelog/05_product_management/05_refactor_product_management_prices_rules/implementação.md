# Implementacao: Mover Precos para Variacoes + Criar Variacoes/Fotos na Criacao

## Visao Geral

Refatoracao do modulo ProductManagement com tres mudancas principais:

1. **Mover campos de preco** (`preco_venda`, `preco_promocional`, `custo`) da tabela `produtos` para a tabela `produto_variacoes`
2. **Permitir adicionar variacoes** no ato de criar um produto (antes so era possivel ao editar)
3. **Permitir adicionar fotos** no ato de criar um produto (antes so era possivel ao editar)

---

## Arquivos Criados

### 1. Migration
**Arquivo:** `app/Modules/ProductManagement/Infrastructure/Persistence/Migrations/2026_05_04_000001_move_prices_to_produto_variacoes.php`

- Adiciona `preco_venda`, `preco_promocional`, `custo` na tabela `produto_variacoes`
- Migra dados existentes copiando precos do produto para cada variacao
- Remove `preco_venda`, `preco_promocional`, `custo` da tabela `produtos`
- Inclui `down()` para reverter a migration

---

## Arquivos Modificados

### 2. Domain Entities

- **`app/Modules/ProductManagement/Domain/Entities/Product.php`** — Removidos `precoVenda`, `precoPromocional`, `custo` (propriedades, constructor, getters, setters)
- **`app/Modules/ProductManagement/Domain/Entities/ProductVariation.php`** — Adicionados `precoVenda`, `precoPromocional`, `custo` (propriedades, constructor, getters, setters)

### 3. DTOs

- **`app/Modules/ProductManagement/Application/DTOs/CreateProductDTO.php`** — Removidos campos de preco; adicionado `?array $variations` para criacao de variacoes inline
- **`app/Modules/ProductManagement/Application/DTOs/UpdateProductDTO.php`** — Removidos campos de preco
- **`app/Modules/ProductManagement/Application/DTOs/CreateProductVariationDTO.php`** — Adicionados `precoVenda`, `precoPromocional`, `custo`
- **`app/Modules/ProductManagement/Application/DTOs/UpdateProductVariationDTO.php`** — Adicionados `precoVenda`, `precoPromocional`, `custo`

### 4. Eloquent Models

- **`app/Modules/ProductManagement/Infrastructure/Persistence/Models/EloquentProductModel.php`** — Removidos `preco_venda`, `preco_promocional`, `custo` de `$fillable` e `$casts`
- **`app/Modules/ProductManagement/Infrastructure/Persistence/Models/EloquentProductVariationModel.php`** — Adicionados `preco_venda`, `preco_promocional`, `custo` em `$fillable` e `$casts`

### 5. Repositories

- **`app/Modules/ProductManagement/Infrastructure/Persistence/Repositories/EloquentProductRepository.php`** — Removidos campos de preco de `save()`, `update()`, `toDomainEntity()`
- **`app/Modules/ProductManagement/Infrastructure/Persistence/Repositories/EloquentProductVariationRepository.php`** — Adicionados campos de preco em `save()`, `update()`, `toDomainEntity()`

### 6. Application Services

- **`app/Modules/ProductManagement/Application/Services/CreateProductService.php`** — Removidos precos do Product; adicionada injecao de `ProductVariationRepositoryInterface`; criacao de variacoes a partir do array `variations` do DTO
- **`app/Modules/ProductManagement/Application/Services/UpdateProductService.php`** — Removidos setters de preco
- **`app/Modules/ProductManagement/Application/Services/CreateProductVariationService.php`** — Adicionados campos de preco na construcao da entidade
- **`app/Modules/ProductManagement/Application/Services/UpdateProductVariationService.php`** — Adicionados setters de preco

### 7. Request Validation

- **`app/Modules/ProductManagement/Presentation/Http/Requests/CreateProductRequest.php`** — Removidas regras de preco do produto; adicionada validacao de `variations.*` com campos de preco
- **`app/Modules/ProductManagement/Presentation/Http/Requests/UpdateProductRequest.php`** — Removidas regras de preco
- **`app/Modules/ProductManagement/Presentation/Http/Requests/CreateProductVariationRequest.php`** — Adicionadas regras para `preco_venda`, `preco_promocional`, `custo`
- **`app/Modules/ProductManagement/Presentation/Http/Requests/UpdateProductVariationRequest.php`** — Adicionadas regras para `preco_venda`, `preco_promocional`, `custo`

### 8. Controllers

- **`app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php`**
  - Adicionadas dependencias: `CorRepositoryInterface`, `CreateFotoService`
  - `create()`: passa dados de `cores` para o frontend
  - `store()`: removidos campos de preco do DTO; adicionado `variations`
  - `toArray()`: removidos campos de preco
  - `variationToArray()`: adicionados campos de preco

- **`app/Modules/ProductManagement/Presentation/Http/Controllers/ProductVariationController.php`**
  - `store()` e `update()`: adicionados campos de preco ao DTO

### 9. Frontend - Create Page

- **`resources/js/pages/admin/products/create.tsx`** — Reescrita completamente
  - Removido card "Precos"
  - Adicionada secao "Variacoes" com formulario inline (cor, tamanho, precos, estoque, SKU, ativo)
  - Adicionada secao "Fotos" com upload de arquivos com preview
  - Dados de `cores` passados pelo controller para select de cor

### 10. Frontend - Edit Page

- **`resources/js/pages/admin/products/edit.tsx`**
  - Removido card "Precos" do formulario do produto
  - Adicionados campos de preco no dialog de nova variacao
  - Interface `Product`: removidos `precoVenda`, `precoPromocional`, `custo`
  - Form data do produto: removidos campos de preco
  - Form data da variacao: adicionados `preco_venda`, `preco_promocional`, `custo`

### 11. Frontend - Index Page

- **`resources/js/pages/admin/products/index.tsx`**
  - Interface `Product`: removidos `precoVenda`, `precoPromocional`, `custo`
  - Interface `Variation`: adicionados `precoVenda`, `precoPromocional`, `custo`
  - Removido badge de preco do produto no header
  - Adicionado badge de preco na variacao expandida

### 12. Frontend - Show Page

- **`resources/js/pages/admin/products/show.tsx`**
  - Interface `Product`: removidos campos de preco
  - Removido card "Precos" da pagina de detalhes
  - Removida funcao `formatCurrency` nao mais utilizada

---

## Comandos para Aplicar as Mudancas

```bash
# 1. Rodar a migration
cd c:/dev/PHP/laravel-comerce
php artisan migrate --path=app/Modules/ProductManagement/Infrastructure/Persistence/Migrations

# 2. Compilar os assets do frontend
npm run build
```

---

## Comando de Commit

```bash
cd c:/dev/PHP/laravel-comerce && git add -A && git commit -m "refactor(product-management): move prices to variations and enable variation/photo creation on product store

Move preco_venda, preco_promocional, custo from produtos to produto_variacoes table.
Enable adding variations and photos during product creation.

Backend:
- New migration to move price columns from produtos to produto_variacoes
- Update Product entity: remove price properties/getters/setters
- Update ProductVariation entity: add price properties/getters/setters
- Update DTOs: remove prices from product DTOs, add to variation DTOs
- Add variations array to CreateProductDTO for inline creation
- Update Eloquent models: adjust fillable/casts
- Update repositories: adjust field mapping
- Update services: CreateProductService creates variations from DTO
- Update requests: add price validation to variation requests
- Update controllers: pass cores to create page, add prices to variation mapping

Frontend:
- Rewrite create page: add variation section with price fields, add photo upload
- Update edit page: move prices from product form to variation dialog
- Update index page: show price badge on variations instead of products
- Update show page: remove prices card from product details"
```
