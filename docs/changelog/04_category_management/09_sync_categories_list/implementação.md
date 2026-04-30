# Implementação: Comando para Sincronizar Categorias Padrões

## Resumo

Criação do comando Artisan `category:sync-defaults` para sincronizar as categorias padrões definidas em `DefaultCategories.php` com a tabela `categories` do banco de dados. O comando é executado automaticamente pelo script `scripts/sync.sh`.

---

## Estrutura do Config

O arquivo `DefaultCategories.php` define categorias raiz e suas sub-categorias:

```php
return [
    'Lingerie' => [
        'name' => 'Lingerie',
        'slug' => 'lingerie',
        'subcategories' => [
            'Calcinhas' => ['name' => 'Calcinhas', 'slug' => 'calcinhas'],
            'Sutiãns' => ['name' => 'Sutiãns', 'slug' => 'sutians'],
            'Conjuntos' => ['name' => 'Conjuntos', 'slug' => 'conjuntos'],
        ],
    ],
    'Modeladores' => [
        'name' => 'Modeladores',
        'slug' => 'modeladores',
        'subcategories' => [
            'Shorts' => ['name' => 'Shorts', 'slug' => 'shorts'],
            'Body' => ['name' => 'Body', 'slug' => 'body'],
            'Leggings' => ['name' => 'Leggings', 'slug' => 'leggings'],
        ],
    ],
    'Moda_gestante' => ['name' => 'Moda gestante', 'slug' => 'moda-gestante'],
    'Infanto_juvenil' => ['name' => 'Infanto juvenil', 'slug' => 'infanto-juvenil'],
];
```

---

## Alterações Realizadas

### 1. Comando Artisan (`Infrastructure/Commands/SyncDefaultCategoriesCommand.php`)

Comando `category:sync-defaults` que:

- Lê o arquivo `DefaultCategories.php`
- Para cada categoria raiz, usa `firstOrCreate` com lookup por `slug + parent_id = null`
  - Se já existe: atualiza `name` e `active = true`
  - Se não existe: cria com `active = true`
- Para cada sub-categoria, usa `firstOrCreate` com lookup por `slug + parent_id = {root_id}`
  - Se já existe: atualiza `name` e `active = true`
  - Se não existe: cria com `active = true`
- Exibe mensagens informativas no console para cada operação

**Por que `firstOrCreate` com composite lookup?**
- Garante que categorias raiz e sub-categorias sejam tratadas como entidades distintas
- Evita conflitos se uma sub-categoria tiver o mesmo slug de uma categoria raiz
- Permite re-sincronização segura (idempotente)

### 2. ServiceProvider (`Infrastructure/Providers/CategoryManagementServiceProvider.php`)

Adicionado método `boot()` que registra o comando no console:

```php
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->commands([
            SyncDefaultCategoriesCommand::class,
        ]);
    }
}
```

### 3. Script de Sincronização (`scripts/sync.sh`)

Adicionada chamada ao novo comando após a sincronização de roles e permissões:

```bash
php artisan category:sync-defaults
```

---

## Como Usar

### Manualmente

```bash
php artisan category:sync-defaults
```

### Via script de sync

```bash
bash scripts/sync.sh
```

---

## Sugestões de Commit

```
feat(category): add artisan command to sync default categories from config

- Add category:sync-defaults command using firstOrCreate with composite lookup
- Sync root categories by slug + parent_id=null
- Sync subcategories by slug + parent_id={root_id}
- Update existing records' name and active status
- Register command in CategoryManagementServiceProvider
- Add command to scripts/sync.sh
```

Opções de mensagem curta:

- `feat(category): add category:sync-defaults artisan command`
- `feat(infrastructure): sync default categories from config to database`
