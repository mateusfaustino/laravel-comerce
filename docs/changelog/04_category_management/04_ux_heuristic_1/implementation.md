# Aplicação da Heurística 1: Visibilidade do Status do Sistema

## Diretrizes Analisadas

O arquivo `docs/diretrizes/heuristics/01-Visibilidade do Status do Sistema.md` estabelece cinco áreas principais:

1. **Indicações de Localização** — O sistema deve responder "onde estou?" com menus ativos destacados, breadcrumbs e títulos.
2. **Feedback de Interação Imediata** — Toda ação do usuário deve gerar reconhecimento imediato (estados de botões, confirmações de sucesso).
3. **Indicadores de Progresso e Carregamento** — Operações não instantâneas devem comunicar que estão em andamento.
4. **Notificações e Mudanças de Estado** — Validação inline, alertas de estado, comunicação de erros.
5. **Filtragem de Informações Relevantes** — Mostrar apenas o que é útil para o usuário.

## Gaps Encontrados no Módulo CategoryManagement

| Diretriz | Estado | Problema |
|----------|--------|----------|
| 1. Localização | ⚠️ Parcial | Breadcrumbs OK, mas o item de menu "Categorias" no sidebar não ficava ativo ao navegar para sub-páginas (show/edit). |
| 2. Feedback Imediato | ❌ Ausente | O backend enviava mensagens flash (`->with('success', ...)`), mas o frontend nunca as exibia. |
| 3. Progresso | ❌ Ausente | O botão de exclusão na dialog de confirmação não tinha estado de carregamento. |
| 4. Notificações | ❌ Ausente | Nenhum mecanismo para exibir mensagens de sucesso/erro das operações CRUD. |
| 5. Filtragem | ✅ OK | Apenas informações relevantes são exibidas. |

## Mudanças Aplicadas

### 1. Destaque Visual do Menu Ativo (Indicação de Localização)

**Arquivo:** `resources/js/components/admin-sidebar.tsx`

- Adicionado `isCurrentOrParentUrl` ao hook `useCurrentUrl`.
- O menu pai "Categorias" agora recebe `isActive={isCurrentOrParentUrl('/admin/categories')}`, destacando-se visualmente quando o usuário está em qualquer sub-rota (`/admin/categories`, `/admin/categories/create`, `/admin/categories/5`, `/admin/categories/5/edit`).
- Isso evita que o usuário se sinta perdido ao navegar para páginas de detalhe ou edição.

### 2. Exibição de Mensagens Flash (Feedback de Sucesso/Erro)

**Arquivos:**
- `app/Http/Middleware/HandleInertiaRequests.php`
- `resources/js/components/flash-messages.tsx`
- `resources/js/layouts/admin-layout.tsx`

- O middleware `HandleInertiaRequests` foi atualizado para compartilhar mensagens flash (`success` e `error`) com todas as páginas Inertia.
- Criado o componente `FlashMessages` que:
  - Lê as mensagens flash de `usePage().props.flash`
  - Exibe um `Alert` verde para sucesso e um `Alert` vermelho para erro
  - Auto-descarta após 5 segundos
- O componente foi integrado ao `AdminLayout`, aparecendo automaticamente em todas as páginas admin.

**Resultado:** Agora, ao criar, atualizar ou remover uma categoria, o usuário vê uma mensagem clara de confirmação (ex: "Categoria criada com sucesso.").

### 3. Estado de Carregamento na Exclusão (Indicador de Progresso)

**Arquivo:** `resources/js/pages/admin/categories/index.tsx`

- Adicionado estado local `deleting` ao componente da listagem.
- O botão "Remover" na dialog de confirmação agora:
  - Mostra um spinner (`Loader2` com `animate-spin`) durante a requisição
  - Altera o texto para "Removendo..."
  - Fica `disabled` enquanto processa
  - Reseta o estado ao fechar o dialog (cancelar, erro ou sucesso)

**Resultado:** O usuário recebe feedback imediato de que a exclusão está em andamento, prevenindo cliques duplos e reduzindo incerteza.

## Arquivos Alterados

- `resources/js/components/admin-sidebar.tsx`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `resources/js/components/flash-messages.tsx` (criado)
- `resources/js/layouts/admin-layout.tsx`
- `resources/js/pages/admin/categories/index.tsx`
