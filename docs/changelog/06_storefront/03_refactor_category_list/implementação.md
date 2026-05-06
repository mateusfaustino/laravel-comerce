# Implementação — Filtrar categorias sem produtos na vitrine

## Resumo
Categorias sem produtos não devem aparecer na seção "Nossas Coleções" da vitrine. Também foram filtradas subcategorias sem produtos para não aparecerem nos chips de cada categoria.

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `app/Modules/Storefront/Application/Services/ListStorefrontHomeService.php` | Adicionado filtro para pular categorias com `productCount === 0` e subcategorias sem produtos |

## Alteração Detalhada

No `ListStorefrontHomeService::execute()`:
- A contagem de produtos (`productCount`) agora é calculada **antes** de construir o DTO da categoria
- Se `productCount === 0`, a categoria é ignorada com `continue`
- Subcategorias filhas também são filtradas: só aparecem se tiverem ao menos 1 produto

## Comando de Commit

```bash
git add -A && git commit -m "fix(storefront): hide categories with no products from storefront homepage

- Skip root categories with productCount === 0 in ListStorefrontHomeService
- Filter subcategories to only show those with at least one product
- Ensures empty categories never appear in the Nossas Coleções section"
```

## Comandos de Deploy

```bash
php artisan route:clear
php artisan config:clear
```
