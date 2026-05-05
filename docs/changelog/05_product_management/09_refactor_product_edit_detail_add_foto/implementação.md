# Fix: Fotos nao aparecem nas telas de editar e detalhe do produto

## Problema

Nas telas de editar produto (`/admin/products/{id}`) e detalhe do produto (`/admin/products/{id}`), as fotos do produto nao apareciam, apesar de existirem fotos cadastradas.

## Causas raiz

1. **Symlink de storage ausente**: O diretorio `public/storage` nao existia, impedindo que o servidor web servisse os arquivos de `storage/app/public`. Sem o symlink, todas as URLs `/storage/...` retornavam 404.

2. **URLs hardcoded no frontend**: As paginas frontend usavam `/storage/${foto.path}` para montar a URL da imagem, em vez de usar a URL gerada pelo Laravel via `Storage::url()`. Isso tornava as URLs frageis e dependentes do symlink.

3. **Upload de fotos na criacao nao funcionava**: A pagina `create.tsx` tinha um campo de upload de fotos, mas o `ProductController::store()` ignorava os arquivos enviados, entao fotos selecionadas durante a criacao nunca eram salvas.

## Solucao

1. Adicionado campo `url` nos metodos `fotoToArray()` do `ProductController` e `FotoController`, usando `Storage::disk('public')->url()` para gerar URLs corretas independentemente da configuracao de symlink.

2. Atualizado o frontend (`show.tsx`, `edit.tsx`, `fotos/index.tsx`) para usar `foto.url` em vez de `/storage/${foto.path}`.

3. Adicionado tratamento de upload de fotos no `ProductController::store()`: apos criar o produto, os arquivos de foto enviados sao salvos no disco `public` e associados ao produto via `CreateFotoService`.

## Arquivos alterados

| Arquivo | Alteracao |
|---------|-----------|
| `app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php` | Adicionado `Storage` facade; campo `url` em `fotoToArray()`; upload de fotos no `store()` |
| `app/Modules/ProductManagement/Presentation/Http/Controllers/FotoController.php` | Adicionado `Storage` facade; campo `url` em `fotoToArray()` |
| `resources/js/pages/admin/products/show.tsx` | Adicionado `url` na interface `Foto`; trocado `src` para `foto.url` |
| `resources/js/pages/admin/products/edit.tsx` | Adicionado `url` na interface `Foto`; trocado `src` para `foto.url` |
| `resources/js/pages/admin/fotos/index.tsx` | Adicionado `url` na interface `FotoWithProduct`; trocado `src` para `foto.url` |

## Commit

```bash
git add app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php app/Modules/ProductManagement/Presentation/Http/Controllers/FotoController.php resources/js/pages/admin/products/show.tsx resources/js/pages/admin/products/edit.tsx resources/js/pages/admin/fotos/index.tsx
git commit -m "fix(product-management): fix photos not displaying on product edit and detail pages

- Add Storage::url() to fotoToArray for correct image URLs
- Replace hardcoded /storage/ prefix with foto.url in frontend
- Handle file uploads in ProductController::store() for create page
- Document storage:link as required deployment step"
```

## Comandos para aplicar as mudancas

```bash
# Criar o symlink de storage (REQUERIDO para que as imagens sejam servidas)
php artisan storage:link

# Limpar cache de rotas
php artisan route:clear

# Limpar cache da aplicacao
php artisan cache:clear

# Rebuild dos assets do frontend
npm run build
```
