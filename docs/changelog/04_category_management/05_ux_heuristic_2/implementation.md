# Aplicação da Heurística 2: Correspondência entre o Sistema e o Mundo Real

## Diretrizes Analisadas

O arquivo `docs/diretrizes/heuristics/02-Correspondência entre o Sistema e o Mundo Real.md` estabelece quatro áreas principais:

1. **Linguagem e Comunicação Familiar** — Usar termos familiares ao usuário, evitar jargões técnicos, mensagens de erro claras.
2. **Mapeamento Natural e Convenções Visuais** — Ícones representativos, posicionamento lógico de controles, componentes que imitam comportamento físico.
3. **Ordem Lógica e Fluxo Natural** — Formulários em sequência lógica, interações que simulam ações físicas.
4. **Feedback Visual com Significado Cultural** — Vermelho = perigo/erro, Verde = sucesso/bom.

## Gaps Encontrados no Módulo CategoryManagement

| Diretriz | Estado | Problema |
|----------|--------|----------|
| 1. Linguagem Familiar | ❌ | "Slug" é jargão técnico; `ID: 5` na página de detalhes é informação de banco de dados; "Confirmar exclusão" não reflete a ação real (desativação). |
| 2. Mapeamento Natural | ❌ | Checkbox para ativo/inativo não imita um interruptor físico; botões de ícone sem tooltip deixam o usuário sem contexto. |
| 3. Fluxo Natural | ⚠️ | O campo "Slug" exige preenchimento manual, mas no mundo real o identificador de URL deriva naturalmente do nome. |
| 4. Significado Cultural | ❌ | Badge "Ativa" usa variante padrão (azul), não verde; badge "Inativa" usa secondary (cinza). |

## Mudanças Aplicadas

### 1. Checkbox → Switch (Mapeamento Natural)

**Arquivos:** `resources/js/pages/admin/categories/create.tsx`, `edit.tsx`

O componente `Switch` imita visualmente e funcionalmente um interruptor de luz real — liga/desliga — que é o modelo mental natural para "ativo/inativo". O `Checkbox` representa uma marcação (checklist), que não corresponde à semântica de ativar/desativar.

Adicionado também um container com borda e descrição auxiliar: "Categorias inativas não aparecem no site."

**Componente instalado:** `npx shadcn@latest add switch` → `resources/js/components/ui/switch.tsx`

### 2. Slug → Identificador da URL + Auto-geração (Linguagem Familiar + Fluxo Natural)

**Arquivos:** `resources/js/pages/admin/categories/create.tsx`, `edit.tsx`

- Label alterado de "Slug \*" para "Identificador da URL"
- Removido o asterisco de obrigatório (é auto-preenchido)
- Adicionado texto auxiliar: "Texto que aparecerá na URL da categoria. Preenchido automaticamente pelo nome."
- Implementada função `slugify()` que gera o identificador automaticamente a partir do nome:
  - Converte para minúsculas
  - Remove acentos (normalização NFD)
  - Substitui caracteres não alfanuméricos por hífens
- Campo continua editável para ajustes manuais

### 3. `ID: 5` → Nome da categoria pai (Linguagem Familiar)

**Arquivos:** `CategoryController.php`, `resources/js/pages/admin/categories/show.tsx`

- Backend: `toArray()` agora resolve o nome da categoria pai via repositório, incluindo `parentName` na resposta.
- Frontend: Exibe `category.parentName ?? 'Nenhuma'` em vez de `ID: ${category.parentId}`.

O usuário não precisa saber o ID interno do banco de dados para entender qual é a categoria pai.

### 4. Tooltips nos botões de ícone (Mapeamento Natural)

**Arquivo:** `resources/js/pages/admin/categories/index.tsx`

Botões de ícone sem rótulo textual são ambíguos. Adicionados tooltips explicativos:
- 👁 Ver detalhes
- ✏️ Editar
- 🗑️ Desativar

### 5. Badges com cores culturais (Feedback Visual com Significado Cultural)

**Arquivos:** `resources/js/pages/admin/categories/index.tsx`, `show.tsx`

- **Ativa:** Badge verde (`bg-green-50 text-green-700 border-green-500`) → semântica cultural de "bom/ativo/prosseguir"
- **Inativa:** Badge cinza (`bg-gray-50 text-gray-600 border-gray-300`) → semântica de "neutro/desativado"
- Removida a variante `default` (azul) que não tem significado cultural claro para status

### 6. "Excluir" → "Desativar" (Linguagem Familiar)

**Arquivo:** `resources/js/pages/admin/categories/index.tsx`

A ação de "excluir" na verdade desativa a categoria (exclusão lógica). Os textos foram ajustados para refletir a realidade:
- Dialog: "Confirmar desativação" em vez de "Confirmar exclusão"
- Descrição: "Ela deixará de aparecer no site" em vez de "Ela será marcada como inativa"
- Botão: "Desativar" / "Desativando..." em vez de "Remover" / "Removendo..."

## Arquivos Alterados

- `resources/js/components/ui/switch.tsx` (instalado via shadcn)
- `resources/js/pages/admin/categories/create.tsx`
- `resources/js/pages/admin/categories/edit.tsx`
- `resources/js/pages/admin/categories/show.tsx`
- `resources/js/pages/admin/categories/index.tsx`
- `app/Modules/CategoryManagement/Presentation/Http/Controllers/CategoryController.php`
