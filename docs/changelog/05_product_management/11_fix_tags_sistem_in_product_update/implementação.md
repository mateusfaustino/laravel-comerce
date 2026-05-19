# Fix — Tags não enviadas no payload do PUT /admin/products/{id}

## Problema 1 — Payload `tags` vazio em PUT/POST /admin/products

Ao editar um produto via `PUT /admin/products/{id}`, o campo `tags` chegava ao backend sempre como array vazio (`tags: []`), mesmo que o usuário tivesse adicionado tags no `TagPicker`. O mesmo defeito existia em `POST /admin/products` (criação).

## Causa raiz (Chain of Thought)

1. O componente `TagPicker` mantém suas próprias tags em estado local React (`tagsValue: TagPickerValue[]`), separado do `data` do `useForm` do Inertia.

2. Em `handleSubmit` (em `edit.tsx` e `create.tsx`) o código antigo era:

   ```tsx
   const tagsPayload = tagsValue.map((t) => (t.id !== undefined ? t.id : t.description));
   setData('tags', tagsPayload);
   setTimeout(() => put(`/admin/products/${product.id}`), 0); // mesmo padrão em create.tsx com post()
   ```

3. O hook `useForm` do Inertia retorna funções `put`/`post` recriadas a cada render, e cada uma **fecha sobre o snapshot atual de `data`** (closure). `setData('tags', ...)` agenda uma atualização de estado, mas:
   - Ainda no mesmo bloco síncrono, o `setTimeout(0)` é agendado.
   - Quando o callback do `setTimeout` dispara, ele referencia o **mesmo `put`/`post` capturado pelo closure de `handleSubmit`**, que por sua vez foi criado pelo render onde `data.tags === []`.
   - O `setTimeout(0)` não obtém um `put`/`post` "fresco" — closures não se atualizam por mais que React tenha re-renderizado.

4. Resultado: o request é enviado com `data.tags` antigo (`[]`), ignorando o que o usuário digitou.

## Correção

Manter `data.tags` sempre sincronizado com `tagsValue` por meio de `useEffect`. Assim, no momento em que o usuário adiciona/remove uma tag, o estado do `useForm` é atualizado imediatamente; quando o submit ocorre, `data.tags` já contém o payload correto, eliminando a corrida de closure.

```tsx
// Sincroniza data.tags com o estado local do TagPicker.
useEffect(() => {
    const payload: (number | string)[] = tagsValue.map((t) =>
        t.id !== undefined ? t.id : t.description,
    );
    setData('tags', payload);
}, [tagsValue]);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/products/${product.id}`); // ou post('/admin/products') no create
};
```

Vantagens:
- Elimina a race condition (sem `setTimeout`).
- Mensagens de erro `errors.tags` refletem o estado atual.
- Comportamento consistente entre criação e edição.

## Arquivos modificados

- `resources/js/pages/admin/products/edit.tsx`
  - Adicionado `useEffect` ao import de `react`.
  - Adicionado `useEffect` que sincroniza `tagsValue` → `data.tags`.
  - `handleSubmit` simplificado: removido `setTimeout` e o `setData('tags', ...)` inline.
- `resources/js/pages/admin/products/create.tsx`
  - Adicionado `useEffect` ao import de `react`.
  - Adicionado `useEffect` análogo ao do `edit.tsx`.
  - `handleSubmit` simplificado: removido `setTimeout` e o `setData('tags', ...)` inline.

## Camadas envolvidas

- **Frontend (Presentation)**: ajuste único na ponte entre estado local do `TagPicker` e `useForm` do Inertia. Backend (Service `SyncProductTagsService`, Repository, Domain) não foi alterado — já estava correto.

## Conformidade

- **Heurísticas de Nielsen**:
  - *#1 Visibilidade do estado do sistema*: o que o usuário vê no `TagPicker` agora é exatamente o que é enviado.
  - *#5 Prevenção de erros*: elimina perda silenciosa de dados na submissão.
- **Mobile First**: nenhuma mudança de layout.
- **DDD/SOLID/Clean Code**: a correção respeita a separação de camadas; nenhuma regra de negócio foi movida para a Apresentação.
- **OWASP**: sem impacto. A validação de `tags` continua sendo feita por `UpdateProductRequest`/`CreateProductRequest` no backend, com normalização e checagem de tipos no `SyncProductTagsService`.

## Como testar

1. Acessar `/admin/products/{id}/edit` de um produto existente.
2. Adicionar uma tag nova (digitar e pressionar Enter).
3. Adicionar uma tag existente (selecionar do dropdown de sugestões).
4. Clicar em **Salvar**.
5. Verificar no DevTools → Network → request `PUT /admin/products/{id}` que o payload `tags` contém os IDs/descrições corretos.
6. Após o redirect, abrir o produto novamente e confirmar que as tags foram persistidas.
7. Repetir os passos 1-6 em `/admin/products/create` (criação).

## Comandos para aplicar as mudanças

Como a correção é puramente frontend (TypeScript/React), basta rebuildar os assets:

```bash
npm run build
```

Para desenvolvimento com HMR:

```bash
npm run dev
```

Nenhuma migration, sync de roles, cache de rotas/config ou alteração de banco é necessária.

---

## Problema 2 — `/admin/tags/search` retorna `Unauthenticated.` mesmo com sessão ativa

### Sintoma

Chamadas para `GET /admin/tags/search?q=am&limit=10` (e qualquer outra rota do módulo `TagManagement`) respondem `401 { "message": "Unauthenticated." }`, mesmo com o usuário logado.

### Causa raiz

O `TagManagementServiceProvider::boot()` registrava as rotas via `$this->loadRoutesFrom(...)`. Esse método **não aplica** o middleware group `web` — logo, a sessão não é iniciada na request, o `auth` middleware não encontra o usuário autenticado e responde `Unauthenticated`.

Os demais módulos do projeto fazem isso corretamente:

- `CategoryManagement` e `ProductManagement` registram suas rotas em `bootstrap/app.php` envoltas em `Route::middleware('web')->group(...)`.
- `StorefrontServiceProvider` faz `Route::middleware('web')->group(__DIR__ . '/../../Presentation/Http/routes.php')`.

### Correção

Em `app/Modules/TagManagement/Infrastructure/Providers/TagManagementServiceProvider.php`, substituir `loadRoutesFrom` por `Route::middleware('web')->group(...)`:

```php
use Illuminate\Support\Facades\Route;

// ...
public function boot(): void
{
    $this->loadMigrationsFrom(__DIR__.'/../Persistence/Migrations');

    // Wrap routes in the 'web' middleware group so session-based auth
    // (and CSRF) is active. Without it, 'auth' returns Unauthenticated.
    Route::middleware('web')
        ->group(__DIR__.'/../../Presentation/Http/routes.php');
}
```

### Aplicar a correção

```bash
php artisan route:clear
php artisan config:clear
```

Nenhum rebuild de assets é necessário (correção puramente backend).

### Arquivos modificados (Problema 2)

- `app/Modules/TagManagement/Infrastructure/Providers/TagManagementServiceProvider.php`

---

## Commit

```bash
git add resources/js/pages/admin/products/edit.tsx \
        resources/js/pages/admin/products/create.tsx \
        app/Modules/TagManagement/Infrastructure/Providers/TagManagementServiceProvider.php \
        docs/changelog/05_product_management/11_fix_tags_sistem_in_product_update/implementação.md

git commit -m "fix(products,tags): persist tags on submit and restore session auth on tag routes

- products edit/create: replace setTimeout/setData race condition in handleSubmit
  with a useEffect that keeps Inertia useForm 'data.tags' in sync with the
  TagPicker's local state. Fixes empty 'tags' array in PUT /admin/products/{id}
  and POST /admin/products payloads. Root cause: Inertia's put/post are captured
  by closure with the data snapshot at render time; setTimeout(0) does not
  refresh the closure, so submissions used the stale (empty) tags array.
- TagManagementServiceProvider: wrap module routes in Route::middleware('web')
  ->group(...) instead of loadRoutesFrom(). Without the 'web' middleware group,
  sessions weren't started and 'auth' always responded Unauthenticated, breaking
  /admin/tags/search and every other tag route.

Affected files:
- resources/js/pages/admin/products/edit.tsx
- resources/js/pages/admin/products/create.tsx
- app/Modules/TagManagement/Infrastructure/Providers/TagManagementServiceProvider.php

Refs: docs/changelog/05_product_management/11_fix_tags_sistem_in_product_update"
```
