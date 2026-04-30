# Implementação: Refatoração da Lista de Categorias com Accordion

## Resumo

Refatoração da rota `/admin/categories` para exibir apenas categorias raiz (ativas), com accordion colapsável que carrega sub-categorias sob demanda via AJAX, com paginação.

---

## Regras de Negócio

1. A lista principal mostra apenas **categorias** (parent_id = null) e **ativas**
2. Sub-categorias **não aparecem** na lista principal
3. Ao clicar em uma categoria com sub-categorias, um **accordion expande** mostrando suas sub-categorias
4. As sub-categorias são carregadas **via AJAX** (sem recarregar a página)
5. As sub-categorias possuem **paginação** própria (5 por página)

---

## Alterações Realizadas

### 1. Domain — Category Entity (`Domain/Entities/Category.php`)

- Adicionado campo `childrenCount` com getter/setter para suportar `withCount('children')` do Eloquent

### 2. Repository Interface (`Domain/Repositories/CategoryRepositoryInterface.php`)

- `findRootCategoriesPaginated(int $perPage, int $page, ?bool $active = null): array`
- `countRootCategories(?bool $active = null): int`
- `findChildrenPaginated(int $parentId, int $perPage, int $page): array`
- `countChildren(int $parentId): int`

### 3. Eloquent Repository (`Infrastructure/Persistence/Repositories/EloquentCategoryRepository.php`)

- Implementado `findRootCategoriesPaginated()` com `withCount('children')` e paginação
- Implementado `countRootCategories()` filtrando apenas parent_id null
- Implementado `findChildrenPaginated()` com paginação
- Implementado `countChildren()` contando filhos de um parent_id
- Atualizado `toDomainEntity()` para setar `childrenCount` a partir do `children_count` do Eloquent

### 4. Application Service (`Application/Services/ListCategoriesService.php`)

- Adicionado `executeRootOnly(int $perPage, int $page, ?bool $active = null): array` — lista apenas categorias raiz
- Adicionado `executeChildren(int $parentId, int $perPage, int $page): array` — lista sub-categorias paginadas

### 5. Controller (`Presentation/Http/Controllers/CategoryController.php`)

- `index()`: Trocado `execute()` por `executeRootOnly(active: true)` para listar apenas categorias raiz ativas
- Adicionado `subcategories(Request $request, int $id): JsonResponse` — endpoint JSON para sub-categorias paginadas
- `toArray()`: Adicionado campo `childrenCount`

### 6. Routes (`Presentation/Http/routes.php`)

- Adicionado `GET /admin/categories/{id}/subcategories` com middleware `can:list_categories`

### 7. Frontend — index.tsx

- Substituída tabela simples por tabela com **Collapsible** (accordion) por linha
- Coluna "Tipo" substituída por "Sub-categorias" mostrando contagem em badge
- Categorias com sub-categorias exibem botão **ChevronDown** para expandir
- Ao expandir, sub-categorias são carregadas via **fetch AJAX** para `/admin/categories/{id}/subcategories`
- Loading spinner exibido durante carregamento
- Sub-categorias com paginação própria (5 por página, controles de navegação)
- Cada sub-categoria mostra nome, badge de status e botões de ação (ver, editar, desativar)

---

## Heurísticas de Nielsen Aplicadas

| Heurística | Aplicação |
|---|---|
| H1 — Visibilidade do status | Loading spinner ao carregar sub-categorias; badge com contagem |
| H2 — Correspondência com o mundo real | Termos "Categoria" e "Sub-categoria"; accordion natural como pastas |
| H4 — Consistência e padrões | Mesmo padrão de badges, tooltips e botões em categorias e sub-categorias |
| H7 — Flexibilidade e eficiência | Accordion permite ver sub-categorias sem sair da página; paginação evita sobrecarga |
| H8 — Design estético e minimalista | Lista limpa com apenas categorias; sub-categorias só aparecem sob demanda |

---

## Sugestões de Commit

```
feat(category): refactor categories list to show root categories with expandable subcategories

- Show only active root categories on /admin/categories
- Add collapsible accordion to expand subcategories on demand
- Add JSON endpoint for paginated subcategories (GET /admin/categories/{id}/subcategories)
- Add childrenCount field to Category entity and toArray transformation
- Add paginated repository methods for root categories and children
- Add executeRootOnly and executeChildren to ListCategoriesService
```

Opções de mensagem curta:

- `feat(category): add accordion with paginated subcategories to categories list`
- `refactor(category): list only root categories with expandable children`
