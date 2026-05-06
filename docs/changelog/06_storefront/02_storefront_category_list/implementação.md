# Implementação — Visão de Coleção (Category List)

## Resumo
Implementação da rota `/categoria/{slug}` que exibe todos os produtos de uma categoria (incluindo subcategorias), com breadcrumb navigation, header hero, filtros por subcategoria e grid de produtos. Segue boas práticas de e-commerce.

## Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `app/Modules/Storefront/Application/Services/ListStorefrontCategoryService.php` | Serviço de aplicação para dados da página de coleção |
| `resources/js/pages/category-page.tsx` | Página Inertia da visão de coleção |

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `app/Modules/Storefront/Presentation/Http/Controllers/StorefrontController.php` | Adicionado `ListStorefrontCategoryService` no construtor e action `category()` |
| `app/Modules/Storefront/Presentation/Http/routes.php` | Adicionada rota `GET /categoria/{slug}` |

## Rota

| Método | URI | Nome | Descrição |
|--------|-----|------|-----------|
| GET | `/categoria/{slug}` | `category.show` | Lista produtos de uma categoria |

## Comportamento

### Dados retornados pelo `ListStorefrontCategoryService`
- **Categoria**: nome, slug, imagem, descrição, subcategorias (com productCount), productCount total, breadcrumb (categoria pai, se existir)
- **Produtos**: produtos da categoria + produtos de todas as subcategorias (deduplicados por ID), mapeados para `StorefrontProductDTO`

### Página `category-page.tsx`
- **Breadcrumb**: Início > [Categoria Pai] > Categoria Atual (Heurística 1 — visibilidade de localização)
- **Hero banner**: imagem da categoria com nome e contagem de produtos
- **Filtros por subcategoria**: chips clicáveis com contagem de produtos (Heurística 6 — reconhecimento ao invés de memorização)
- **Grid de produtos**: 2 colunas mobile, 4 colunas desktop (Mobile First)
- **Estado vazio**: mensagem clara com CTA para voltar à home (Heurística 9 — recuperação de erros)
- **Header e Footer**: consistentes com as demais páginas da vitrine (Heurística 4 — consistência e padrões)

## Comando de Commit

```bash
git add -A && git commit -m "feat(storefront): add category collection page at /categoria/{slug}

- Add ListStorefrontCategoryService with product aggregation across subcategories
- Add StorefrontController::category() action
- Add GET /categoria/{slug} route (category.show)
- Create category-page.tsx with hero banner, subcategory filters, product grid
- Include breadcrumb navigation and empty state per Nielsen heuristics
- Follow Mobile First and e-commerce best practices"
```

## Comandos de Deploy

```bash
php artisan route:clear
php artisan config:clear
npm run build
```
