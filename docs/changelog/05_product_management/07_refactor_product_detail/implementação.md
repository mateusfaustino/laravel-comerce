# Fix: Fotos e Variacoes na tela de detalhe do produto

## Problema

Na tela de detalhe do produto (`/admin/products/{id}`), as fotos e as variacoes do produto nao apareciam.

### Causas raiz

1. **Variacoes nao exibidas**: A tela de detalhe nao tinha nenhuma secao para listar variacoes. O `ProductController::show()` nao buscava variacoes, e o frontend `show.tsx` nao tinha interface nem componente para exibi-las.

2. **VariacoesCount sempre 0**: O `EloquentProductRepository::findById()` nao usava `withCount('variacoes')`, entao `variacoesCount` nunca era preenchido no detalhe do produto.

3. **Fotos**: O backend ja buscava e enviava fotos corretamente, mas a contagem de variacoes incorreta podia confundir o usuario sobre o estado geral do produto.

## Solucao

1. Adicionado `->withCount('variacoes')` no `findById` do repository para carregar a contagem correta.
2. Adicionado `ProductVariationRepositoryInterface` como dependencia do `ProductController` e buscado variacoes via `findByProductId()` no metodo `show()`.
3. Adicionado secao de variacoes no `show.tsx` com exibicao de cor (nome + swatch RGB), tamanho, status ativo/inativo, preco de venda, estoque e SKU.

## Arquivos alterados

| Arquivo | Alteracao |
|---------|-----------|
| `app/Modules/ProductManagement/Infrastructure/Persistence/Repositories/EloquentProductRepository.php` | Adicionado `->withCount('variacoes')` no `findById()` |
| `app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php` | Adicionado `ProductVariationRepositoryInterface` no construtor; buscado variacoes no `show()` |
| `resources/js/pages/admin/products/show.tsx` | Adicionado interface `Variation`, props `variations`, secao de listagem de variacoes com cor, tamanho, preco, estoque e SKU |

## Commit

```bash
git add app/Modules/ProductManagement/Infrastructure/Persistence/Repositories/EloquentProductRepository.php app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php resources/js/pages/admin/products/show.tsx
git commit -m "fix(product-management): show photos and variations on product detail page

- Add withCount('variacoes') to findById so variacoesCount is populated
- Fetch variations via ProductVariationRepositoryInterface in show()
- Add variations section to show.tsx with color, size, price, stock, SKU
- Photos were already being fetched; variations display was missing"
```

## Comandos para aplicar as mudancas

```bash
# Limpar cache de rotas
php artisan route:clear

# Limpar cache da aplicacao
php artisan cache:clear

# Rebuild dos assets do frontend
npm run build
```
