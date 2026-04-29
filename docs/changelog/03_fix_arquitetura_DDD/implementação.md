# Refatoração da Estrutura DDD dos Módulos

## Objetivo

Ajustar a estrutura de pastas dos módulos `app\Modules\Authentication` e `app\Modules\AdminPanel` para estar em conformidade com as diretrizes do documento `docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md`.

## Diretrizes Aplicadas

A estrutura correta de um módulo DDD no monolito modular é:

```
app/Modules/{NomeDoModulo}/
├── Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Services/
│   ├── Events/
│   └── Repositories/
├── Application/
│   ├── DTOs/
│   └── Services/
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   ├── Migrations/
│   │   └── Seeders/
│   ├── External/
│   └── Providers/
└── Presentation/
    ├── Http/
    │   ├── Controllers/
    │   ├── Requests/
    │   └── Middleware/
    └── Resources/
```

## Alterações Realizadas

### Módulo Authentication

#### 1. Application Layer
- **De:** `Application/UseCases/`
- **Para:** `Application/Services/`
- **Arquivos movidos:**
  - `LoginUseCase.php`
  - `RegisterUseCase.php`

#### 2. Infrastructure Layer — Persistence
- **Models:**
  - **De:** `Infrastructure/Models/`
  - **Para:** `Infrastructure/Persistence/Models/`
  - `EloquentPermissionModel.php`
  - `EloquentRoleModel.php`
  - `EloquentUserModel.php`

- **Repositories:**
  - **De:** `Infrastructure/Repositories/`
  - **Para:** `Infrastructure/Persistence/Repositories/`
  - `EloquentPermissionRepository.php`
  - `EloquentRoleRepository.php`
  - `EloquentUserRepository.php`

- **Migrations:**
  - **De:** `Infrastructure/Migrations/`
  - **Para:** `Infrastructure/Persistence/Migrations/`
  - `0001_01_01_000000_create_users_table.php`
  - `2025_08_14_170933_add_two_factor_columns_to_users_table.php`
  - `2026_04_28_000001_create_roles_table.php`
  - `2026_04_28_000002_create_permissions_table.php`
  - `2026_04_28_000003_create_role_permissions_table.php`
  - `2026_04_28_000004_add_role_id_to_users_table.php`

- **Seeders:**
  - **De:** `Infrastructure/Seeders/`
  - **Para:** `Infrastructure/Persistence/Seeders/`
  - `AuthenticationSeeder.php`

#### 3. Presentation Layer
- **De:** `Interfaces/`
- **Para:** `Presentation/Http/`
- **Controllers:**
  - `AuthController.php`
- **Requests:**
  - `LoginRequest.php`
  - `RegisterRequest.php`

#### 4. Camadas mantidas (já corretas)
- `Domain/Entities/` (User, Role, Permission)
- `Domain/Repositories/` (interfaces)
- `Domain/Services/`
- `Application/DTOs/`
- `Infrastructure/Commands/` (SyncRolesPermissionsCommand)
- `Infrastructure/Config/` (Roles.php)
- `Infrastructure/Providers/` (AuthenticationServiceProvider)

### Módulo AdminPanel

#### 1. Presentation Layer
- **De:** `Interfaces/`
- **Para:** `Presentation/Http/`
- **Controllers:**
  - `AdminController.php`
- **Middleware:**
  - `CheckAdminPanelAccess.php`

### Arquivos Externos Atualizados

As referências nos arquivos fora dos módulos também foram atualizadas:

- `routes/admin.php` — namespaces do AdminController e CheckAdminPanelAccess
- `app/Actions/Fortify/CreateNewUser.php` — RegisterUseCase e EloquentUserModel
- `app/Actions/Fortify/ResetUserPassword.php` — EloquentUserModel
- `app/Concerns/ProfileValidationRules.php` — EloquentUserModel
- `app/Models/User.php` — EloquentUserModel
- `database/factories/UserFactory.php` — PHPDoc do EloquentUserModel
- `database/seeders/DatabaseSeeder.php` — AuthenticationSeeder
- `scripts/migrate.sh` — caminho das migrations
- `scripts/seed.sh` — namespace do seeder

## Verificação

- `composer dump-autoload` executado com sucesso
- `php vendor/bin/pint` executado sem erros (14 arquivos corrigidos)
- `php artisan route:list --path=admin` confirmou 2 rotas funcionando
- `php artisan list` confirmou comando `auth:sync-roles-permissions` registrado
- Zero referências remanescentes aos namespaces antigos
