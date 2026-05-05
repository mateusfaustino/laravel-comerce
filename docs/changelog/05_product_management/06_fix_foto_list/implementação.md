# Fix: Listagem de Fotos por Produto

## Problema

Na rota `/admin/fotos`, ao expandir um produto para ver suas fotos, a mensagem "Nenhuma foto cadastrada para este produto" aparecia mesmo quando fotos existiam.

### Causa raiz

O frontend fazia um `fetch` para `/admin/products/{id}` esperando uma resposta JSON com as fotos do produto. No entanto, essa rota é uma página Inertia que retorna HTML (não JSON) quando o header `X-Inertia` não está presente. O `response.json()` falhava silenciosamente, e o handler de `catch` definia o array de fotos como vazio.

### Solução

Criado um endpoint dedicado `GET /admin/fotos/by-product/{productId}` no `FotoController` que retorna JSON com as fotos do produto, eliminando a dependência fragil do formato de resposta Inertia.

## Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `app/Modules/ProductManagement/Presentation/Http/Controllers/FotoController.php` | Adicionado método `byProduct()` e `fotoToArray()` |
| `app/Modules/ProductManagement/Presentation/Http/routes.php` | Adicionado rota `GET /admin/fotos/by-product/{productId}` |
| `resources/js/pages/admin/fotos/index.tsx` | Alterado `fetchFotosForProduct` para usar o novo endpoint |

## Commit

```bash
git add app/Modules/ProductManagement/Presentation/Http/Controllers/FotoController.php app/Modules/ProductManagement/Presentation/Http/routes.php resources/js/pages/admin/fotos/index.tsx
git commit -m "fix(product-management): add dedicated endpoint for fetching fotos by product

The fotos index page was fetching /admin/products/{id} expecting JSON,
but that route returns an Inertia HTML page. Added a dedicated
GET /admin/fotos/by-product/{productId} endpoint that returns JSON,
fixing the empty fotos listing issue."
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
