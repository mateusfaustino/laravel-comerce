# Implementação: Sistema de Roles e Permissions

**Data:** 28/04/2026  
**Task:** Criar sistema de roles e permissions no módulo de Authentication

---

## Objetivo

Implementar um sistema de roles e permissions baseado no schema definido em `User_roles_permission.md` e nas configurações de `Roles.php`, seguindo a arquitetura DDD do módulo de Authentication.

---

## Modelo de Dados

```
users                    roles                   permissions
├── id (PK)             ├── id (PK)             ├── id (PK)
├── name                 ├── slug (UNIQUE)       ├── slug (UNIQUE)
├── email (UNIQUE)       ├── name                ├── description
├── password             └── timestamps          └── timestamps
├── role_id (FK → roles)
└── timestamps           role_permissions
                         ├── id (PK)
                         ├── role_id (FK → roles)
                         ├── permission_id (FK → permissions)
                         ├── UNIQUE(role_id, permission_id)
                         └── timestamps
```

### Relacionamentos

- **users ↔ roles**: 1:N (um user tem um role, um role pertence a muitos users)
- **roles ↔ permissions**: N:M (via tabela pivot `role_permissions`)

---

## Migrações Criadas

| Arquivo | Descrição |
|---------|-----------|
| `2026_04_28_000001_create_roles_table.php` | Cria tabela `roles` (id, slug, name, timestamps) |
| `2026_04_28_000002_create_permissions_table.php` | Cria tabela `permissions` (id, slug, description, timestamps) |
| `2026_04_28_000003_create_role_permissions_table.php` | Cria tabela pivot `role_permissions` com FKs e unique constraint |
| `2026_04_28_000004_add_role_id_to_users_table.php` | Adiciona `role_id` (FK nullable) à tabela `users` |

---

## Arquivos Criados

### Domain Layer

| Arquivo | Descrição |
|---------|-----------|
| `Domain/Entities/Role.php` | Entidade de domínio Role (slug, name, permissions) |
| `Domain/Entities/Permission.php` | Entidade de domínio Permission (slug, description) |
| `Domain/Repositories/RoleRepositoryInterface.php` | Interface do repositório de roles |
| `Domain/Repositories/PermissionRepositoryInterface.php` | Interface do repositório de permissions |

### Infrastructure Layer

| Arquivo | Descrição |
|---------|-----------|
| `Infrastructure/Models/EloquentRoleModel.php` | Model Eloquent para roles com relação `permissions()` |
| `Infrastructure/Models/EloquentPermissionModel.php` | Model Eloquent para permissions com relação `roles()` |
| `Infrastructure/Repositories/EloquentRoleRepository.php` | Implementação do repositório de roles |
| `Infrastructure/Repositories/EloquentPermissionRepository.php` | Implementação do repositório de permissions |
| `Infrastructure/Commands/SyncRolesPermissionsCommand.php` | Comando artisan `auth:sync-roles-permissions` |

---

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `Infrastructure/Models/EloquentUserModel.php` | Adicionado `role_id` no fillable, relação `role()`, métodos `hasPermission()` e `hasRole()` |
| `Infrastructure/Seeders/AuthenticationSeeder.php` | Refatorado para criar roles, permissions e um usuário por role via config |
| `Infrastructure/Providers/AuthenticationServiceProvider.php` | Adicionados binds de RoleRepository e PermissionRepository, mergeConfig do Roles.php, registro do comando |
| `Domain/Entities/User.php` | Adicionado propriedade `roleId` com getter/setter |
| `Infrastructure/Repositories/EloquentUserRepository.php` | Mapeamento de `role_id` no save/update/toDomainEntity |

---

## Comando Artisan: `auth:sync-roles-permissions`

Sincroniza as roles e permissions definidas no arquivo de configuração `Roles.php` com o banco de dados.

### Uso

```bash
php artisan auth:sync-roles-permissions
```

### Comportamento

1. Lê as roles e permissions de `config('authentication.roles')`
2. Para cada role no config:
   - Cria a role no banco se não existir
   - Atualiza o nome da role se tiver mudado
   - Cria as permissions no banco se não existirem
   - Sincroniza a relação role ↔ permissions (adiciona/remove conforme necessário)
3. Avisa sobre roles no banco que não estão no config

---

## Configuração: `Roles.php`

Arquivo: `app/Modules/Authentication/Infrastructure/Config/Roles.php`

```php
return [
    'ADMIN' => [
        'name' => 'Administrador',
        'permissions' => ['access_admin_panel'],
    ],
    'CUSTOMER' => [
        'name' => 'Cliente',
        'permissions' => ['access_customer_panel'],
    ],
    'DEV' => [
        'name' => 'Desenvolvedor',
        'permissions' => ['access_dev_panel'],
    ],
];
```

> A configuração é registrada como `authentication.roles` via `mergeConfigFrom` no ServiceProvider.

---

## Seeder: Usuários Criados

O `AuthenticationSeeder` cria automaticamente um usuário para cada role definida no config:

| Role | Nome | E-mail | Senha |
|------|------|--------|-------|
| ADMIN | Administrador | admin@sac.com | password |
| CUSTOMER | Cliente | customer@sac.com | password |
| DEV | Desenvolvedor | dev@sac.com | password |

---

## Métodos Auxiliares no EloquentUserModel

```php
// Verificar se o usuário tem uma role específica (por slug)
$user->hasRole('ADMIN'); // bool

// Verificar se o usuário tem uma permissição específica (por slug)
$user->hasPermission('access_admin_panel'); // bool

// Relação Eloquent
$user->role; // EloquentRoleModel|null
```

---

## Validação

- `composer dump-autoload` executado com sucesso (7712 classes)
- `pint --test app/` passou em todos os 47 arquivos
- `php artisan auth:sync-roles-permissions --help` registrado e funcional
