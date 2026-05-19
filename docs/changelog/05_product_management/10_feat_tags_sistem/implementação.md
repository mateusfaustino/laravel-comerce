# Feature: Sistema de Tags para Produtos

## Objetivo

Implementar um sistema completo de tags (folksonomia) para produtos, com um novo
contexto delimitado (bounded context) `TagManagement` em arquitetura DDD modular.
Tags possuem relacao Many-to-Many com produtos via tabela `produtos_tags`. O painel
administrativo ganha um CRUD de tags com permissao `manage_tags`, menu lateral com
submenus e um seletor de tags com autocomplete e criacao on-the-fly nas telas de
criacao e edicao de produto.

## Decisoes de design

- **Novo bounded context (`TagManagement`)**: Mantem coesao alta e baixo
  acoplamento. As demais bounded contexts (ProductManagement) acessam tags apenas
  via interfaces de aplicacao publicadas.
- **Folksonomia com normalizacao**: Descricoes de tag sao normalizadas em
  `Tag::normalize()` (lowercase + trim + colapso de espacos) antes de qualquer
  persistencia/comparacao, evitando duplicatas como "Verao", "VERAO", "verao  ".
- **Create-on-the-fly via picker**: O componente `TagPicker` aceita ids
  existentes e descricoes novas no mesmo payload; o backend
  (`SyncProductTagsService`) decide se cria via `findOrCreateByDescription` ou
  reusa a tag existente.
- **Permissao unica**: `manage_tags` controla todo o CRUD e attach/detach. Foi
  adicionada ao papel `ADMIN` em `Roles.php`.

## Estrutura DDD do modulo TagManagement

```
app/Modules/TagManagement/
├── Domain/
│   ├── Entities/Tag.php
│   └── Repositories/TagRepositoryInterface.php
├── Application/
│   ├── DTOs/{CreateTagDTO,UpdateTagDTO}.php
│   └── Services/
│       ├── CreateTagService.php
│       ├── UpdateTagService.php
│       ├── DeleteTagService.php
│       ├── ListTagsService.php
│       ├── SearchTagsService.php
│       ├── GetTagDetailsService.php
│       ├── AttachTagToProductService.php
│       ├── DetachTagFromProductService.php
│       └── SyncProductTagsService.php
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Migrations/
│   │   │   ├── 2026_05_04_000002_create_tags_table.php
│   │   │   └── 2026_05_04_000003_create_produtos_tags_table.php
│   │   ├── Models/EloquentTagModel.php
│   │   └── Repositories/EloquentTagRepository.php
│   └── Providers/TagManagementServiceProvider.php
└── Presentation/
    └── Http/
        ├── Controllers/TagController.php
        ├── Requests/{CreateTagRequest,UpdateTagRequest}.php
        └── routes.php
```

## Banco de dados

### Tabela `tags`

| Coluna       | Tipo         | Restricoes              |
|--------------|--------------|-------------------------|
| `id`         | bigint PK    | auto-increment          |
| `description`| varchar(255) | UNIQUE, INDEX           |
| `created_at` | timestamp    |                         |
| `updated_at` | timestamp    |                         |

### Tabela `produtos_tags`

| Coluna       | Tipo         | Restricoes                              |
|--------------|--------------|-----------------------------------------|
| `id`         | bigint PK    | auto-increment                          |
| `produto_id` | bigint FK    | -> `produtos.id`, ON DELETE CASCADE     |
| `tag_id`     | bigint FK    | -> `tags.id`, ON DELETE CASCADE         |
| `created_at` | timestamp    |                                         |
| `updated_at` | timestamp    |                                         |

`UNIQUE(produto_id, tag_id)` garante idempotencia. Indices em `produto_id` e
`tag_id` aceleram lookups bidirecionais.

## Rotas (admin)

| Metodo  | URI                                          | Nome                          | Permissao      |
|---------|----------------------------------------------|-------------------------------|----------------|
| GET     | `/admin/tags`                                | `admin.tags.index`            | `manage_tags`  |
| GET     | `/admin/tags/search?q=`                      | `admin.tags.search`           | `manage_tags`  |
| GET     | `/admin/tags/products/search?q=`             | `admin.tags.products.search`  | `manage_tags`  |
| GET     | `/admin/tags/create`                         | `admin.tags.create`           | `manage_tags`  |
| POST    | `/admin/tags`                                | `admin.tags.store`            | `manage_tags`  |
| GET     | `/admin/tags/{id}`                           | `admin.tags.show`             | `manage_tags`  |
| GET     | `/admin/tags/{id}/edit`                      | `admin.tags.edit`             | `manage_tags`  |
| PUT     | `/admin/tags/{id}`                           | `admin.tags.update`           | `manage_tags`  |
| DELETE  | `/admin/tags/{id}`                           | `admin.tags.destroy`          | `manage_tags`  |
| POST    | `/admin/tags/{id}/products`                  | `admin.tags.products.attach`  | `manage_tags`  |
| DELETE  | `/admin/tags/{id}/products/{productId}`      | `admin.tags.products.detach`  | `manage_tags`  |

## Frontend (Inertia + React + Tailwind)

- **`resources/js/pages/admin/tags/index.tsx`**: Listagem com paginacao e busca
  por descricao. Acoes por linha: Ver / Editar / Excluir.
- **`resources/js/pages/admin/tags/create.tsx`**: Formulario simples de criacao.
- **`resources/js/pages/admin/tags/edit.tsx`**: Formulario de edicao.
- **`resources/js/pages/admin/tags/show.tsx`**: Detalhe da tag com lista de
  produtos vinculados (com thumbnail) e campo de busca para vincular novos
  produtos via debounce + autocomplete.
- **`resources/js/components/tag-picker.tsx`**: Componente reutilizavel de
  multi-tags com autocomplete (debounce 250ms). Suporta:
  - Selecionar tag existente (via API `/admin/tags/search`).
  - Criar nova tag pressionando Enter (folksonomia).
  - Remover tag (botao X em cada chip ou Backspace no campo vazio).
- **`resources/js/components/admin-sidebar.tsx`**: Menu "Tags" (icone `Tags`)
  com submenus "Listar Tags" e "Criar Tag".

## Integracao com ProductManagement

- `EloquentProductModel::tags()` belongsToMany via `produtos_tags`.
- `ProductController::store()` e `update()` chamam
  `SyncProductTagsService::execute($productId, $tagsPayload)` apos criar/atualizar
  o produto. Payload e `array<int|string>` (ids existentes ou descricoes novas).
- `ProductController::edit()` envia `selectedTags` para o frontend; `show()`
  envia `tags`.
- Validacao em `CreateProductRequest` e `UpdateProductRequest` aceita
  `'tags' => ['nullable', 'array']` com `'tags.*' => ['nullable']`.

## Acessibilidade e UX (Nielsen + Mobile First)

- TagPicker com `aria-label` no input, chips com `aria-label` no botao de
  remocao e suporte a teclado (Enter para adicionar, Backspace para remover).
- Mensagens claras de sucesso/erro via flash sessions.
- Layout responsivo (grid `1 / sm:2 / lg:3` na lista de produtos vinculados).
- Confirmacao em dialog para acoes destrutivas (excluir tag, desvincular
  produto).

## Seguranca (OWASP)

- Toda escrita exige autenticacao + permissao `manage_tags`.
- FormRequests com `min:1`, `max:255` previnem payloads abusivos.
- Rotas com `whereNumber('id')` impedem injecoes em parametros.
- Foreign keys com `cascadeOnDelete` e validacao `exists:produtos,id` em attach.
- Normalizacao remove ambiguidade (case/espacos) antes de comparacao -
  protege contra duplicatas exploradas em UI.

## Arquivos criados

- `app/Modules/TagManagement/Domain/Entities/Tag.php`
- `app/Modules/TagManagement/Domain/Repositories/TagRepositoryInterface.php`
- `app/Modules/TagManagement/Application/DTOs/CreateTagDTO.php`
- `app/Modules/TagManagement/Application/DTOs/UpdateTagDTO.php`
- `app/Modules/TagManagement/Application/Services/CreateTagService.php`
- `app/Modules/TagManagement/Application/Services/UpdateTagService.php`
- `app/Modules/TagManagement/Application/Services/DeleteTagService.php`
- `app/Modules/TagManagement/Application/Services/ListTagsService.php`
- `app/Modules/TagManagement/Application/Services/SearchTagsService.php`
- `app/Modules/TagManagement/Application/Services/GetTagDetailsService.php`
- `app/Modules/TagManagement/Application/Services/AttachTagToProductService.php`
- `app/Modules/TagManagement/Application/Services/DetachTagFromProductService.php`
- `app/Modules/TagManagement/Application/Services/SyncProductTagsService.php`
- `app/Modules/TagManagement/Infrastructure/Persistence/Migrations/2026_05_04_000002_create_tags_table.php`
- `app/Modules/TagManagement/Infrastructure/Persistence/Migrations/2026_05_04_000003_create_produtos_tags_table.php`
- `app/Modules/TagManagement/Infrastructure/Persistence/Models/EloquentTagModel.php`
- `app/Modules/TagManagement/Infrastructure/Persistence/Repositories/EloquentTagRepository.php`
- `app/Modules/TagManagement/Infrastructure/Providers/TagManagementServiceProvider.php`
- `app/Modules/TagManagement/Presentation/Http/Controllers/TagController.php`
- `app/Modules/TagManagement/Presentation/Http/Requests/CreateTagRequest.php`
- `app/Modules/TagManagement/Presentation/Http/Requests/UpdateTagRequest.php`
- `app/Modules/TagManagement/Presentation/Http/routes.php`
- `resources/js/components/tag-picker.tsx`
- `resources/js/pages/admin/tags/index.tsx`
- `resources/js/pages/admin/tags/create.tsx`
- `resources/js/pages/admin/tags/edit.tsx`
- `resources/js/pages/admin/tags/show.tsx`

## Arquivos modificados

| Arquivo | Alteracao |
|---------|-----------|
| `app/Modules/ProductManagement/Infrastructure/Persistence/Models/EloquentProductModel.php` | Adicionada relacao `tags()` belongsToMany via `produtos_tags` |
| `app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php` | Injecao de `TagRepositoryInterface` e `SyncProductTagsService`; sync em `store`/`update`; envio de `tags`/`selectedTags` em `show`/`edit` |
| `app/Modules/ProductManagement/Presentation/Http/Requests/CreateProductRequest.php` | Validacao `tags` => array nullable |
| `app/Modules/ProductManagement/Presentation/Http/Requests/UpdateProductRequest.php` | Validacao `tags` => array nullable |
| `app/Modules/Authentication/Infrastructure/Config/Roles.php` | Adicionada permissao `manage_tags` ao papel ADMIN |
| `bootstrap/providers.php` | Registrado `TagManagementServiceProvider` |
| `scripts/migrate.sh` | Adicionado bloco para rodar migrations do modulo TagManagement |
| `resources/js/components/admin-sidebar.tsx` | Novo Collapsible "Tags" com submenus "Listar Tags" / "Criar Tag" |
| `resources/js/pages/admin/products/create.tsx` | Integracao do `TagPicker`; estado `tags` no form |
| `resources/js/pages/admin/products/edit.tsx` | Integracao do `TagPicker` com pre-carregamento de `selectedTags` |

## Commit

```bash
git add app/Modules/TagManagement \
        app/Modules/ProductManagement/Infrastructure/Persistence/Models/EloquentProductModel.php \
        app/Modules/ProductManagement/Presentation/Http/Controllers/ProductController.php \
        app/Modules/ProductManagement/Presentation/Http/Requests/CreateProductRequest.php \
        app/Modules/ProductManagement/Presentation/Http/Requests/UpdateProductRequest.php \
        app/Modules/Authentication/Infrastructure/Config/Roles.php \
        bootstrap/providers.php \
        scripts/migrate.sh \
        resources/js/components/admin-sidebar.tsx \
        resources/js/components/tag-picker.tsx \
        resources/js/pages/admin/tags \
        resources/js/pages/admin/products/create.tsx \
        resources/js/pages/admin/products/edit.tsx \
        docs/changelog/05_product_management/10_feat_tags_sistem/implementação.md

git commit -m "feat(tag-management): introduce Tag system with folksonomy and product picker

- New TagManagement bounded context (Domain/Application/Infrastructure/Presentation)
- Many-to-Many produtos <-> tags via produtos_tags join table
- Admin CRUD with manage_tags permission, sidebar menu and search/autocomplete
- TagPicker component with create-on-the-fly integrated in product create/edit
- Tag detail page lists attached products and supports attach/detach
- Description normalization (lowercase + trim + collapse whitespace) prevents duplicates"
```

## Comandos para aplicar as mudancas

```bash
# 1. Rodar as migrations do novo modulo (cria tags e produtos_tags)
bash scripts/migrate.sh

# 2. Sincronizar permissoes (cria a permissao manage_tags e atribui ao papel ADMIN)
php artisan auth:sync-roles

# 3. Limpar caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# 4. Rebuild do frontend
npm run build
```

## Como testar

1. Acessar `/admin/tags` apos login com usuario ADMIN.
2. Criar uma tag pelo menu "Tags > Criar Tag" (ex.: "promocao verao").
3. Editar um produto existente, abrir o card "Tags", buscar pela tag criada e
   selecionar; tambem digitar uma descricao nova e pressionar Enter para
   criar on-the-fly. Salvar.
4. Voltar a `/admin/tags`, abrir o detalhe da tag e confirmar que o produto
   aparece vinculado. Vincular outro produto via campo de busca; desvincular
   um produto.
5. Excluir uma tag; verificar que ela desaparece da listagem e que os
   produtos perdem o vinculo (mas permanecem ativos).
