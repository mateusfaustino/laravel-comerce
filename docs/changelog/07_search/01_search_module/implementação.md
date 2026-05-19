# Search Module — Live storefront search + tag landing page

## Objetivo

Implementar busca em tempo real no header da loja: ao digitar, o usuário vê sugestões (produtos, categorias e tags) e cards de produtos correspondentes, sem recarregar a página. Adicionar uma página de landing por tag (`/tag/{slug}`) acessível ao clicar em uma sugestão de tag.

## Escopo

- Novo bounded context `Search` (DDD: Application + Infrastructure + Presentation; sem Domain próprio).
- Endpoint JSON `GET /search?q=&limit=` — sugestões + cards de produto.
- Página Inertia `GET /tag/{slug}` — produtos atribuídos a uma tag.
- Componente reutilizável `<SearchBar />` em React, com debounce, sugestões, cards, estado vazio e dismiss por click-outside / Escape.
- Integração na home da loja (`store-homepage.tsx`).

## Estrutura DDD do módulo

```
app/Modules/Search/
├── Application/
│   ├── DTOs/
│   │   └── SearchSuggestionDTO.php
│   └── Services/
│       ├── SearchService.php          # query produtos + categorias + tags
│       └── GetTagProductsService.php  # produtos de uma tag pelo slug
├── Infrastructure/
│   └── Providers/
│       └── SearchServiceProvider.php  # routes wrapped in Route::middleware('web')
└── Presentation/
    └── Http/
        ├── Controllers/
        │   └── SearchController.php
        └── routes.php
```

Decisões técnicas:

- Sem Domain layer próprio: o módulo é puramente de leitura e consome `ProductRepositoryInterface`, `FotoRepositoryInterface`, `ProductVariationRepositoryInterface` e `TagRepositoryInterface`. Evita acoplar lógica de domínio nova quando todas as regras já vivem nos contextos existentes.
- Consultas cross-context usam `DB::table(...)` raw dentro dos serviços do módulo (precedente: [TagController.searchProducts](file:///c:/dev/PHP/laravel-comerce/app/Modules/TagManagement/Presentation/Http/Controllers/TagController.php)). Mantém o feature self-contained sem alargar os repositories existentes.
- Reuso do `StorefrontProductDTO` da Storefront para que o `<ProductCard />` existente funcione sem alterações.
- URL de tag: `/tag/{slug}` onde `slug = lower(description) com espaços trocados por hífens`. O reverse-lookup desfaz hífens e busca por descrição (que já é normalizada na escrita).

## Rotas

| Método | Caminho        | Nome          | Tipo     | Descrição                                              |
|--------|----------------|---------------|----------|--------------------------------------------------------|
| GET    | `/search`      | `search.live` | JSON     | Live search: `{ suggestions[], products[] }`           |
| GET    | `/tag/{slug}`  | `tag.show`    | Inertia  | Página com produtos da tag                             |

Ambas rotas são públicas. Validação de input em `SearchController::live` aceita `q` (string, max 100) e `limit` (int 1–10, padrão 5).

## Regras de relevância

- Sugestões (cap = `limit`, default 5):
  1. Produtos por nome (com prefix-match priorizado via `ORDER BY CASE WHEN nome LIKE 'term%' THEN 0 ELSE 1 END`).
  2. Categorias por nome (se ainda houver espaço).
  3. Tags por descrição (se ainda houver espaço).
- Cards (até 24): união de produtos com `nome LIKE` e produtos atrelados a tags com `description LIKE`. IDs distintos, com prefix-match no nome empurrado para o topo.

## Frontend

| Arquivo                                                      | Tipo       | Descrição                                                       |
|--------------------------------------------------------------|------------|-----------------------------------------------------------------|
| `resources/js/components/store/search-bar.tsx`               | Componente | Barra de busca reutilizável com dropdown live                   |
| `resources/js/pages/tag-page.tsx`                            | Página     | Landing page de tag (renderizada via Inertia)                   |
| `resources/js/pages/store-homepage.tsx`                      | Página     | Modificada: usa `<SearchBar variant="desktop\|mobile" />`       |

`<SearchBar />` em detalhes:

- Debounce de 250 ms; ignora termos com menos de 2 caracteres.
- `AbortController` cancela requisições obsoletas quando o usuário continua digitando.
- Click-outside e tecla `Escape` fecham o dropdown.
- Acessibilidade: `role="combobox"`, `aria-expanded`, `aria-controls`, opções com `role="option"`.
- Mobile First: layout default mobile, `md:` aplica overrides desktop.

## Heurísticas de Nielsen aplicadas

- **#1 Visibilidade do estado do sistema**: spinner inline no input enquanto a request está pendente; estado vazio com texto explícito ("Sua busca não retornou produtos. Simplifique sua pesquisa...").
- **#2 Correspondência com o mundo real**: badges em português (`Produto`, `Categoria`, `Tag`) ao lado de cada sugestão.
- **#3 Controle e liberdade**: `Escape` e click-outside fecham o dropdown. Cancela requisições antigas.
- **#6 Reconhecimento em vez de memorização**: as sugestões aparecem instantaneamente; o usuário não precisa lembrar nomes exatos.
- **#7 Flexibilidade e eficiência de uso**: clique direto em sugestão navega para o destino; cards permitem ir direto ao produto.
- **#8 Design estético e minimalista**: dropdown com hierarquia clara (sugestões > grade de produtos > estado vazio).

## Segurança (OWASP)

- Validação de input (`q` máx 100 chars, `limit` 1–10) impede payloads abusivos.
- `LIKE` parametrizado e termo escapado (`%`, `_`, `\\`) — sem concatenação de SQL.
- Rotas públicas mas read-only; nenhum dado sensível exposto. Apenas produtos/categorias com `active = true`.
- A página `/tag/{slug}` usa `abort(404)` para tags inexistentes (sem leak de existência via mensagens).

## Arquivos criados

- `app/Modules/Search/Application/DTOs/SearchSuggestionDTO.php`
- `app/Modules/Search/Application/Services/SearchService.php`
- `app/Modules/Search/Application/Services/GetTagProductsService.php`
- `app/Modules/Search/Infrastructure/Providers/SearchServiceProvider.php`
- `app/Modules/Search/Presentation/Http/Controllers/SearchController.php`
- `app/Modules/Search/Presentation/Http/routes.php`
- `resources/js/components/store/search-bar.tsx`
- `resources/js/pages/tag-page.tsx`
- `docs/changelog/07_search/01_search_module/implementação.md`

## Arquivos modificados

- `bootstrap/providers.php` — registra `SearchServiceProvider`.
- `resources/js/pages/store-homepage.tsx` — substitui forms inline por `<SearchBar variant="desktop|mobile" />` e remove `searchTerm`/`handleSearch`.

## Como testar

1. Subir o ambiente: `bash scripts/migrate.sh` (caso necessário; este módulo não adiciona migrations).
2. `php artisan route:clear; php artisan config:clear`
3. `npm run build` (ou `npm run dev` para HMR).
4. Acessar `/` na loja, digitar no campo de busca: confirmar que aparecem sugestões (até 5) e cards de produto.
5. Clicar em sugestão de tipo `Produto` → vai para `/produto/{slug}`.
6. Clicar em sugestão de tipo `Categoria` → vai para `/categoria/{slug}`.
7. Clicar em sugestão de tipo `Tag` → vai para `/tag/{slug}` e a página lista os produtos da tag.
8. Pesquisar termo sem matches → ver mensagem "Sua busca não retornou produtos...".
9. Pressionar `Esc` ou clicar fora → dropdown fecha.

## Comandos para aplicar

```bash
php artisan route:clear
php artisan config:clear
npm run build
```

Nenhuma migration, sync de roles ou alteração de banco é necessária.

## Commit

```bash
git add app/Modules/Search/ \
        bootstrap/providers.php \
        resources/js/components/store/search-bar.tsx \
        resources/js/pages/tag-page.tsx \
        resources/js/pages/store-homepage.tsx \
        docs/changelog/07_search/01_search_module/implementação.md

git commit -m "feat(search): add live storefront search and tag landing page

- New Search bounded context (Application + Infrastructure + Presentation)
  exposing GET /search (JSON) and GET /tag/{slug} (Inertia).
- SearchService aggregates products by name and via matching tags, returning
  up to 5 mixed suggestions (products first, then categories, then tags) and
  up to 24 product cards. Cross-context reads use raw DB queries scoped to
  the module.
- GetTagProductsService loads products attached to a tag identified by a
  slugified description.
- New <SearchBar /> React component: debounced fetch (250ms), AbortController
  cancellation, suggestions list with Produto/Categoria/Tag badges, product
  card grid, empty state with friendly copy, click-outside and Escape dismiss,
  ARIA combobox semantics, mobile-first layout.
- Tag landing page reusing the storefront header, breadcrumb and ProductCard.
- store-homepage.tsx replaces both inline search forms with <SearchBar />.

Affected files:
- app/Modules/Search/**
- bootstrap/providers.php
- resources/js/components/store/search-bar.tsx
- resources/js/pages/tag-page.tsx
- resources/js/pages/store-homepage.tsx

Refs: docs/changelog/07_search/01_search_module"
```
