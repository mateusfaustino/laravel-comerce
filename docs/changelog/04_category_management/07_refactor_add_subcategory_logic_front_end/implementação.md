# Implementação: Frontend — Categoria vs Sub-categoria

## Resumo

Implementação das regras de negócio no frontend do módulo CategoryManagement para distinguir entre **Categoria** (parent_id = null) e **Sub-categoria** (parent_id ≠ null). O backend já havia sido implementado na etapa anterior.

---

## Alterações Realizadas

### 1. Backend — CategoryController (`app/Modules/CategoryManagement/Presentation/Http/Controllers/CategoryController.php`)

- **`create()`**: Trocado `findAll(active: true)` por `findRootCategories(active: true)` para listar apenas categorias de nível superior como opções de "Categoria Pai". Prop `parentCategories` renomeada para `rootCategories`.
- **`edit()`**: Mesma mudança de `findAll` para `findRootCategories`. Adicionada prop `subcategories` com os filhos da categoria (quando for categoria raiz).
- **`show()`**: Adicionada prop `subcategories` com os filhos da categoria.
- **`toArray()`**: Adicionado campo `isSubcategory` (boolean) derivado de `$category->isSubcategory()`.

### 2. Frontend — create.tsx

- Adicionado **toggle de tipo** (Categoria / Sub-categoria) com dois botões estilizados.
- Quando "Categoria" está selecionado, o campo "Categoria Pai" fica **oculto** e `parent_id` é limpo no submit.
- Quando "Sub-categoria" está selecionado, o campo "Categoria Pai" aparece como **obrigatório**, listando apenas categorias raiz.
- Mensagem contextual de ajuda muda conforme o tipo selecionado.
- Prop `parentCategories` renomeada para `rootCategories`.

### 3. Frontend — edit.tsx

- Mesmo toggle de tipo de `create.tsx`, com estado inicial baseado em `category.isSubcategory`.
- Se a categoria é do tipo "Categoria" e possui sub-categorias, elas são exibidas em uma lista com links para seus detalhes e badges de status.
- Ao tentar converter de categoria para sub-categoria, o backend impede se houver filhos (validação já existente).

### 4. Frontend — show.tsx

- Adicionado campo "Tipo" com Badge diferenciada (default para Categoria, secondary para Sub-categoria).
- Campo "Categoria Pai" agora só é exibido quando a categoria é uma sub-categoria.
- Seção "Sub-categorias" exibida para categorias raiz que possuem filhos, com links e badges de status.
- Label "Slug" alterado para "Identificador da URL" (consistência com Heurística 2).

### 5. Frontend — index.tsx

- Coluna "Slug" substituída por coluna "Tipo" com Badge diferenciada.
- Nome da categoria agora exibe com `font-medium` para destaque visual.

---

## Heurísticas de Nielsen Aplicadas

| Heurística | Aplicação |
|---|---|
| H1 — Visibilidade do status | Toggle de tipo mostra claramente a seleção atual; badges indicam tipo e status |
| H2 — Correspondência com o mundo real | Termos "Categoria" e "Sub-categoria" são familiares; "Categoria Pai" em vez de "parent_id" |
| H4 — Consistência e padrões | Mesmo padrão de toggle, badges e layouts em todas as telas |
| H8 — Design estético e minimalista | Campo "Categoria Pai" só aparece quando relevante (sub-categoria) |

---

## Sugestões de Commit

```
feat(category): add category/sub-category type toggle to frontend forms

- Add type selector (Categoria/Sub-categoria) on create and edit pages
- Conditionally show parent category field for sub-categories only
- Display sub-categories list on edit and show pages for root categories
- Replace slug column with type column on index page
- Update CategoryController to pass rootCategories and subcategories
- Add isSubcategory field to toArray() transformation
```

Opções de mensagem curta:

- `feat(category): implement category/subcategory UI distinction`
- `feat(frontend): add category type toggle with conditional parent field`
