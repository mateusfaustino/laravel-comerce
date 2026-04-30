# Implementação do Módulo CategoryManagement

## Objetivo

Criar o módulo de gerenciamento de categorias com operações CRUD, hierarquia pai/filho, deleção lógica e controle de permissões no painel administrativo.

## Estrutura DDD

```
app/Modules/CategoryManagement/
├── Domain/
│   ├── Entities/Category.php
│   └── Repositories/CategoryRepositoryInterface.php
├── Application/
│   ├── DTOs/
│   │   ├── CreateCategoryDTO.php
│   │   └── UpdateCategoryDTO.php
│   └── Services/
│       ├── CreateCategoryService.php
│       ├── ListCategoriesService.php
│       ├── UpdateCategoryService.php
│       └── DeleteCategoryService.php
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Migrations/2026_04_28_000005_create_categories_table.php
│   │   ├── Models/EloquentCategoryModel.php
│   │   └── Repositories/EloquentCategoryRepository.php
│   └── Providers/CategoryManagementServiceProvider.php
└── Presentation/
    └── Http/
        ├── Controllers/CategoryController.php
        ├── Requests/
        │   ├── CreateCategoryRequest.php
        │   └── UpdateCategoryRequest.php
        └── routes.php
```

## Backend

### Migration

Tabela `categories`:
- `id`: PK
- `name`: varchar(255)
- `slug`: varchar(255) unique
- `parent_id`: FK nullable para `categories` (auto-relacionamento)
- `active`: boolean default true
- `timestamps`

### Domain

**Category Entity**: entidade pura com propriedades name, slug, parentId, active, createdAt, updatedAt.

**CategoryRepositoryInterface**: define contratos para findById, findBySlug, save, update, findAll, findPaginated, count, deactivate, findHierarchy.

### Application

- **CreateCategoryService**: valida slug único e parent_id existente, cria entidade e persiste.
- **ListCategoriesService**: retorna lista paginada com metadados de paginação.
- **UpdateCategoryService**: valida slug único (exceto a si mesma), previne auto-referência como pai.
- **DeleteCategoryService**: executa deleção lógica (active = false).

### Infrastructure

- **EloquentCategoryModel**: modelo Eloquent com relações `parent()` (BelongsTo) e `children()` (HasMany).
- **EloquentCategoryRepository**: implementação do repositório usando Eloquent, com suporte a paginação e hierarquia.
- **CategoryManagementServiceProvider**: registra o binding da interface para implementação.

### Presentation

**CategoryController** (Thin Controller):
- `index`: lista paginada
- `create`: formulário com categorias pai disponíveis
- `store`: criação
- `show`: detalhes
- `edit`: formulário de edição
- `update`: atualização
- `destroy`: deleção lógica

**Rotas** (`Presentation/Http/routes.php`):
- Protegidas por `auth`, `verified` e middleware `can:` por permissão
- `/admin/categories` → list_categories
- `/admin/categories/create` → register_category
- `/admin/categories` (POST) → register_category
- `/admin/categories/{id}` → list_categories
- `/admin/categories/{id}/edit` → edit_category
- `/admin/categories/{id}` (PUT) → edit_category
- `/admin/categories/{id}` (DELETE) → delete_category

### Sistema de Permissões

As permissões já estavam configuradas em `Roles.php`:
- `list_categories`
- `register_category`
- `edit_category`
- `order_category`
- `delete_category`

**Gates dinâmicos**: `AuthenticationServiceProvider` agora registra automaticamente gates para todas as permissões definidas no config, permitindo o uso do middleware `can:` do Laravel.

## Frontend

### Layout Administrativo

- **AdminSidebar**: sidebar com menu colapsível para "Categorias" contendo "Listar Categorias" e "Adicionar Categoria"
- **AdminLayout**: layout compartilhado com breadcrumbs, sidebar e header

### Páginas

- **admin/categories/index**: tabela paginada com ações (ver, editar, remover), confirmação de exclusão em modal
- **admin/categories/create**: formulário com nome, slug, categoria pai (select), status ativo
- **admin/categories/edit**: formulário pré-preenchido com filtro para evitar auto-seleção
- **admin/categories/show**: detalhes da categoria em grid

### Heurísticas de Nielsen aplicadas

1. **Visibilidade do status**: breadcrumbs ativos, badge de status (Ativa/Inativa), paginação visível
2. **Consistência**: mesmo padrão de formulários, botões e layout em todas as páginas
3. **Prevenção de erros**: modal de confirmação para exclusão, validação em tempo real
4. **Reconhecimento**: ícones padronizados (Eye, Pencil, Trash2), labels claros
5. **Controle e liberdade**: botão Cancelar em formulários, link Voltar em todas as páginas

## Integração

- `bootstrap/providers.php`: registrado `CategoryManagementServiceProvider`
- `bootstrap/app.php`: registradas rotas do módulo via `withRouting(then: ...)`

## Verificação

- `composer dump-autoload --no-scripts`: OK (7728 classes)
- `php vendor/bin/pint`: 20 arquivos, todos passaram
- `php artisan route:list --path=admin`: 9 rotas confirmadas
