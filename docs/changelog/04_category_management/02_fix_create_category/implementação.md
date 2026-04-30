# Correção: Erro no Select de Categoria Pai

## Problema

Na rota `/admin/categories/create`, o console exibia o erro:

```
Uncaught Error: A <Select.Item /> must have a value prop that is not an empty string.
This is because the Select value can be set to an empty string to clear the selection
and show the placeholder.
```

## Causa

O componente `SelectItem` do Radix UI (base do shadcn/ui Select) não aceita `value=""`.
O código continha uma opção vazia para representar "nenhuma categoria pai":

```tsx
<SelectItem value="">Nenhuma</SelectItem>
```

O Radix UI usa string vazia internamente para controlar o estado de "nenhum item
selecionado" e exibir o placeholder. Por isso, proíbe explicitamente que um
`SelectItem` tenha `value=""`.

## Solução

### 1. Remover o SelectItem vazio

A própria funcionalidade do Select já permite deixar o campo sem seleção — nesse
caso o `placeholder` é exibido. Não é necessário um item explícito para
"Nenhuma".

Removido de `resources/js/pages/admin/categories/create.tsx` e `edit.tsx`:
```tsx
// REMOVIDO
<SelectItem value="">Nenhuma</SelectItem>
```

### 2. Converter empty string para null no submit

Como o estado inicial de `parent_id` era `''` (string vazia), ao enviar o
formulário sem selecionar nada, o backend recebia uma string vazia em vez de
`null`, falhando na validação `nullable|integer`.

Ajustado o handler de submit em ambas as páginas para converter `''` em `null`:

```tsx
post('/admin/categories', {
    data: {
        ...data,
        parent_id: data.parent_id || null,
    },
});
```

## Arquivos Alterados

- `resources/js/pages/admin/categories/create.tsx`
- `resources/js/pages/admin/categories/edit.tsx`
