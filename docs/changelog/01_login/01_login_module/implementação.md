# Implementação: Módulo de Authentication (DDD)

**Data:** 28/04/2026  
**Task:** Refatorar a lógica de login em DDD no módulo de Authentication

---

## Objetivo

Refatorar a lógica de autenticação existente (baseada em Fortify + Eloquent direto) para seguir a arquitetura de **Monolito Modular + DDD**, conforme as diretrizes do arquivo `docs/diretrizes/DDD/AI_diretrizes_DDD_monolito_modular.md`.

---

## Estrutura Criada

```
app/Modules/Authentication/
├── Domain/
│   ├── Entities/
│   │   └── User.php                              # Entidade de domínio (sem dependência do Laravel)
│   ├── Repositories/
│   │   └── UserRepositoryInterface.php            # Interface do repositório (contrato do domínio)
│   └── Services/
│       └── AuthenticateUser.php                   # Serviço de domínio para verificação de credenciais
├── Application/
│   ├── DTOs/
│   │   ├── LoginDTO.php                           # Data Transfer Object para login
│   │   └── RegisterDTO.php                        # Data Transfer Object para registro
│   └── UseCases/
│       ├── LoginUseCase.php                       # Caso de uso: autenticar usuário
│       └── RegisterUseCase.php                    # Caso de uso: registrar novo usuário
├── Infrastructure/
│   ├── Migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php       # Migração movida de database/migrations
│   │   └── 2025_08_14_170933_add_two_factor_columns_to_users_table.php
│   ├── Models/
│   │   └── EloquentUserModel.php                  # Model Eloquent (implementação de infraestrutura)
│   ├── Providers/
│   │   └── AuthenticationServiceProvider.php       # Bind de UserRepositoryInterface → EloquentUserRepository
│   ├── Repositories/
│   │   └── EloquentUserRepository.php             # Implementação do repositório com Eloquent
│   └── Seeders/
│       └── AuthenticationSeeder.php               # Seeder com 2 usuários
└── Interfaces/
    ├── Controllers/
    │   └── AuthController.php                     # Controller HTTP (entrada/saída)
    └── Requests/
        ├── LoginRequest.php                       # Validação de request de login
        └── RegisterRequest.php                    # Validação de request de registro
```

---

## Fluxo DDD Implementado

```
Controller → UseCase → Domain Entity → Repository Interface
                                              ↓
                                     EloquentUserRepository (Infrastructure)
                                              ↓
                                     EloquentUserModel (Infrastructure)
```

### Regras de dependência respeitadas

- **Domain** não depende de Laravel, não usa Eloquent, não acessa banco diretamente
- **Application** orquestra o fluxo, não contém regra de negócio complexa, não acessa banco diretamente
- **Infrastructure** implementa interfaces do Domain, pode usar Laravel/Eloquent
- **Interfaces** apenas entrada/saída HTTP, sem regra de negócio

---

## Alterações em Arquivos Existentes

| Arquivo | Alteração |
|---------|-----------|
| `app/Models/User.php` | Agora extende `EloquentUserModel` em vez de `Authenticatable` diretamente (compatibilidade reversa) |
| `app/Actions/Fortify/CreateNewUser.php` | Refatorado para usar `RegisterUseCase` via injeção de dependência |
| `app/Actions/Fortify/ResetUserPassword.php` | Atualizado para usar `EloquentUserModel` em vez de `App\Models\User` |
| `app/Concerns/ProfileValidationRules.php` | Atualizado para referenciar `EloquentUserModel` em vez de `App\Models\User` |
| `bootstrap/providers.php` | Adicionado `AuthenticationServiceProvider` |
| `database/seeders/DatabaseSeeder.php` | Alterado para chamar `AuthenticationSeeder` |
| `database/factories/UserFactory.php` | Atualizado PHPDoc para referenciar `EloquentUserModel` |
| `resources/js/pages/auth/login.tsx` | Textos da interface traduzidos para Português |

### Migrações movidas

- `database/migrations/0001_01_01_000000_create_users_table.php` → `app/Modules/Authentication/Infrastructure/Migrations/`
- `database/migrations/2025_08_14_170933_add_two_factor_columns_to_users_table.php` → `app/Modules/Authentication/Infrastructure/Migrations/`

As migrações originais foram removidas de `database/migrations/`.

---

## Seeder - Usuários Criados

| Nome | E-mail | Senha |
|------|--------|-------|
| Admin User | admin@sac.com | password |
| Regular User | user@sac.com | password |

---

## Scripts de Automação

### `scripts/migrate.sh`
Executa todas as migrations (globais + módulos):
```bash
bash scripts/migrate.sh          # rodar migrations
bash scripts/migrate.sh --fresh  # fresh migrate
```

### `scripts/seed.sh`
Executa todas as seeders (globais + módulos):
```bash
bash scripts/seed.sh
```

---

## Frontend - Login

A página `resources/js/pages/auth/login.tsx` foi atualizada com textos em Português:

| Campo | Antes (EN) | Depois (PT) |
|-------|-----------|-------------|
| Título | Log in to your account | Entre na sua conta |
| Descrição | Enter your email and password below to log in | Insira seu e-mail e senha abaixo para entrar |
| Head | Log in | Entrar |
| Label email | Email address | Endereço de e-mail |
| Placeholder email | email@example.com | email@exemplo.com |
| Label senha | Password | Senha |
| Placeholder senha | Password | Senha |
| Link esqueceu | Forgot password? | Esqueceu a senha? |
| Checkbox | Remember me | Lembrar de mim |
| Botão | Log in | Entrar |
| Link cadastro | Don't have an account? / Sign up | Não tem uma conta? / Cadastre-se |

---

## Validação

- `composer dump-autoload` executado com sucesso (7703 classes)
- `php artisan route:list` todas as rotas funcionando
- `pint --test app/` passou em todos os 33 arquivos
- TypeScript compila sem erros novos (erro pré-existente em cart-modal.tsx)

---

## Configuração do Banco de Dados

O `.env` foi configurado para conectar ao banco MySQL do Docker Compose:

| Variável | Valor |
|----------|-------|
| DB_CONNECTION | mysql |
| DB_HOST | db |
| DB_PORT | 3306 |
| DB_DATABASE | sac |
| DB_USERNAME | sac |
| DB_PASSWORD | sac |

> Nota: Para conectar do host (ex: DBeaver), use host `127.0.0.1` e porta `3300`.
