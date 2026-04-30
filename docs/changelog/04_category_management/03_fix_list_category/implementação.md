# Correção: Lista de Categorias não Aparecia

## Problema

Na rota `/admin/categories/`, a lista de categorias não estava sendo exibida corretamente.

## Causa

O `CategoryController` passava objetos da camada de Domínio (`Category` entity) diretamente para o `Inertia::render()`. Quando o Inertia serializa objetos PHP para JSON:

1. As propriedades privadas da entidade não são expostas de forma limpa
2. Os objetos `CarbonImmutable` (usados em `createdAt`/`updatedAt`) não serializam como strings de data, gerando estruturas complexas de JSON que o frontend não consegue interpretar

O frontend espera um array simples com campos como `id`, `name`, `slug`, `parentId`, `active`, `createdAt` (string), `updatedAt` (string), mas recebia objetos mal serializados.

## Solução

Criado um método privado `toArray()` no controller para transformar a entidade de domínio em um array plano antes de passar para o Inertia:

```php
private function toArray($category): array
{
    return [
        'id' => $category->getId(),
        'name' => $category->getName(),
        'slug' => $category->getSlug(),
        'parentId' => $category->getParentId(),
        'active' => $category->isActive(),
        'createdAt' => $category->getCreatedAt()?->toDateTimeString(),
        'updatedAt' => $category->getUpdatedAt()?->toDateTimeString(),
    ];
}
```

Todos os métodos do controller que enviam entidades para o frontend foram atualizados para usar `array_map([$this, 'toArray'], ...)`:

- `index()` — lista paginada de categorias
- `create()` — lista de categorias pai
- `show()` — detalhe de uma categoria
- `edit()` — categoria em edição + lista de categorias pai

## Arquivos Alterados

- `app/Modules/CategoryManagement/Presentation/Http/Controllers/CategoryController.php`
