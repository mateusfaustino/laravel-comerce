# Implementacao - Secao de Categorias Desativadas

## Objetivo

Adicionar uma secao na pagina `/admin/categories` para listar exclusivamente as categorias raiz desativadas, com a possibilidade de exclusao permanente. Ao excluir uma categoria desativada, todas as suas sub-categorias tambem devem ser removidas do banco de dados.

## Alteracoes Realizadas

### Backend

#### 1. Repositorio - Metodo `permanentlyDelete`

- **Arquivo:** `app/Modules/CategoryManagement/Domain/Repositories/CategoryRepositoryInterface.php`
- **Arquivo:** `app/Modules/CategoryManagement/Infrastructure/Persistence/Repositories/EloquentCategoryRepository.php`

Adicionado o metodo `permanentlyDelete(int $id): void` na interface e implementado no repositorio Eloquent. A implementacao exclui primeiro todas as sub-categorias (`parent_id = $id`) e em seguida a categoria raiz. Isso garante a consistencia referencial sem depender de `ON DELETE CASCADE`.

#### 2. Service - `PermanentlyDeleteCategoryService`

- **Arquivo:** `app/Modules/CategoryManagement/Application/Services/PermanentlyDeleteCategoryService.php`

Criado service na camada de Aplicacao que valida a existencia da categoria antes de delegar a exclusao permanente ao repositorio. Lanca `ValidationException` caso a categoria nao exista.

#### 3. Controller - `CategoryController`

- **Arquivo:** `app/Modules/CategoryManagement/Presentation/Http/Controllers/CategoryController.php`

- **`index()`**: Agora busca tambem as categorias raiz inativas via `$this->categoryRepository->findRootCategories(active: false)` e as envia ao frontend como `inactiveCategories`.
- **`forceDestroy(int $id)`**: Novo metodo que executa `PermanentlyDeleteCategoryService` e redireciona com mensagem de sucesso.

#### 4. Rotas

- **Arquivo:** `app/Modules/CategoryManagement/Presentation/Http/routes.php`

Adicionada rota `DELETE /{id}/force` apontando para `CategoryController::forceDestroy`, protegida pelo gate `delete_category`.

### Frontend

#### 1. Pagina de Listagem - `index.tsx`

- **Arquivo:** `resources/js/pages/admin/categories/index.tsx`

- **Props**: Adicionado `inactiveCategories: Category[]`.
- **Estado**: Adicionados `forceDeleteId` e `forceDeleting` para controlar o dialogo de exclusao permanente.
- **Secao desativadas**: Renderizada apenas quando `inactiveCategories.length > 0`. Exibe as categorias com estilo diferenciado (`border-dashed`, `bg-muted/30`, texto com `text-muted-foreground`) para clara distincao visual.
- **Acoes por item**: Visualizar, Editar e Excluir permanentemente (icon `Trash2` vermelho).
- **Dialogo de confirmacao**: Titulo "Confirmar exclusao permanente" e descricao alertando que a acao e irreversivel e todas as sub-categorias serao removidas.

## Heuristicas de Nielsen Aplicadas

- **H1 - Visibilidade do estado do sistema**: Categorias desativadas sao exibidas em secao separada com estilo visual distinto, evitando confusao com as ativas.
- **H5 - Prevencao de erros**: Dialogo de confirmacao explicito com alerta sobre a exclusao irreversivel de sub-categorias.
- **H8 - Design estetico e minimalista**: Secao de desativadas utiliza bordas tracejadas e cores suaves, indicando visualmente o estado secundario.

## Sugestoes de Mensagens de Commit

```text
feat(category): add deactivated categories section with permanent delete;Add permanentlyDelete to CategoryRepositoryInterface and Eloquent impl;Create PermanentlyDeleteCategoryService for domain-level validation;Update CategoryController index to pass inactive root categories;Add forceDestroy method and DELETE /{id}/force route;Render deactivated section on admin categories index page;Add confirmation dialog warning about irreversible deletion.
```
