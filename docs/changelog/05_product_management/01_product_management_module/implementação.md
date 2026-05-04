# Implementacao do Modulo ProductManagement

## Visao Geral

Modulo de gerenciamento de produtos implementado seguindo a arquitetura DDD (Domain-Driven Design) em monolito modular, com Laravel 12 no backend e React + TypeScript + Inertia.js no frontend.

---

## Estrutura do Modulo

```
app/Modules/ProductManagement/
├── Application/
│   ├── DTOs/
│   │   ├── CreateCorDTO.php
│   │   ├── CreateFotoDTO.php
│   │   ├── CreateProductDTO.php
│   │   ├── CreateProductVariationDTO.php
│   │   ├── UpdateCorDTO.php
│   │   ├── UpdateProductDTO.php
│   │   └── UpdateProductVariationDTO.php
│   └── Services/
│       ├── ActivateProductService.php
│       ├── CreateCorService.php
│       ├── CreateFotoService.php
│       ├── CreateProductService.php
│       ├── CreateProductVariationService.php
│       ├── DeleteCorService.php
│       ├── DeleteFotoService.php
│       ├── DeleteProductService.php
│       ├── DeleteProductVariationService.php
│       ├── ListCoresService.php
│       ├── ListFotosService.php
│       ├── ListProductVariationsService.php
│       ├── ListProductsService.php
│       ├── UpdateCorService.php
│       ├── UpdateFotoService.php
│       ├── UpdateProductService.php
│       └── UpdateProductVariationService.php
├── Domain/
│   ├── Entities/
│   │   ├── Cor.php
│   │   ├── Foto.php
│   │   ├── Product.php
│   │   └── ProductVariation.php
│   └── Repositories/
│       ├── CorRepositoryInterface.php
│       ├── FotoRepositoryInterface.php
│       ├── ProductRepositoryInterface.php
│       └── ProductVariationRepositoryInterface.php
├── Infrastructure/
│   ├── Persistence/
│   │   ├── Migrations/
│   │   │   ├── 2026_04_28_000010_create_produtos_table.php
│   │   │   ├── 2026_04_28_000011_create_cores_table.php
│   │   │   ├── 2026_04_28_000012_create_fotos_table.php
│   │   │   ├── 2026_04_28_000013_create_produtos_categorias_table.php
│   │   │   ├── 2026_04_28_000014_create_produto_variacoes_table.php
│   │   │   ├── 2026_04_28_000015_create_produto_variacoes_fotos_table.php
│   │   │   └── 2026_04_28_000016_add_thumbnail_foto_id_to_produtos_table.php
│   │   ├── Models/
│   │   │   ├── EloquentCorModel.php
│   │   │   ├── EloquentFotoModel.php
│   │   │   ├── EloquentProductModel.php
│   │   │   └── EloquentProductVariationModel.php
│   │   └── Repositories/
│   │       ├── EloquentCorRepository.php
│   │       ├── EloquentFotoRepository.php
│   │       ├── EloquentProductRepository.php
│   │       └── EloquentProductVariationRepository.php
│   └── Providers/
│       └── ProductManagementServiceProvider.php
└── Presentation/
    ├── Http/
    │   ├── Controllers/
    │   │   ├── CorController.php
    │   │   ├── FotoController.php
    │   │   ├── ProductController.php
    │   │   └── ProductVariationController.php
    │   ├── Requests/
    │   │   ├── CreateCorRequest.php
    │   │   ├── CreateFotoRequest.php
    │   │   ├── CreateProductRequest.php
    │   │   ├── CreateProductVariationRequest.php
    │   │   ├── UpdateCorRequest.php
    │   │   ├── UpdateProductRequest.php
    │   │   └── UpdateProductVariationRequest.php
    │   └── routes.php
```

---

## Banco de Dados

### Tabela: produtos
| Campo | Tipo | Observacao |
|-------|------|------------|
| id | PK | Auto-incremento |
| nome | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL, UNIQUE |
| tipo_produto | enum | ROUPA_ADULTO, ROUPA_CRIANCA, CALCADO |
| estoque_tipo | enum | INFINITO, LIMITADO |
| descricao | varchar(255) | Nullable |
| preco_venda | decimal | NOT NULL |
| preco_promocional | decimal | Nullable |
| custo | decimal | Nullable |
| sku | varchar(255) | Nullable |
| codigo_barras | varchar(255) | Nullable |
| peso | decimal | Nullable |
| largura | decimal | Nullable |
| altura | decimal | Nullable |
| comprimento | decimal | Nullable |
| active | boolean | Default true |
| thumbnail_foto_id | FK (fotos) | Nullable |
| created_at / updated_at | timestamp | Nullable |

### Tabela: cores
| Campo | Tipo | Observacao |
|-------|------|------------|
| id | PK | Auto-incremento |
| nome | varchar(255) | NOT NULL, UNIQUE |
| cod_rgb | varchar(6) | NOT NULL, regex [0-9A-Fa-f]{6} |

### Tabela: fotos
| Campo | Tipo | Observacao |
|-------|------|------------|
| id | PK | Auto-incremento |
| path | varchar(255) | NOT NULL |
| product_id | FK (produtos) | NOT NULL |
| descricao | varchar(255) | Nullable |
| ordem | int | Default 0 |

### Tabela: produtos_categorias (pivot)
| Campo | Tipo |
|-------|------|
| id | PK |
| product_id | FK (produtos) |
| category_id | FK (categories) |

### Tabela: produto_variacoes
| Campo | Tipo | Observacao |
|-------|------|------------|
| id | PK | Auto-incremento |
| produto_id | FK (produtos) | NOT NULL |
| cor_id | FK (cores) | Nullable |
| tamanho_roupa_adulto | enum | PP, P, M, G, GG, XG |
| tamanho_roupa_crianca | enum | 2, 4, 6, 8, 10, 12, 14 |
| tamanho_calcado | enum | 32-48 |
| active | boolean | Default true |
| quantidade_estoque | int | Default 0 |
| sku | varchar(255) | Nullable |

### Tabela: produto_variacoes_fotos (pivot)
| Campo | Tipo |
|-------|------|
| id | PK |
| produto_variacao_id | FK (produto_variacoes) |
| foto_id | FK (fotos) |

---

## Permissoes

| Permissao | Descricao |
|-----------|-----------|
| `list_products` | Listar produtos |
| `register_product` | Cadastrar produtos |
| `edit_product` | Editar produtos e reativar |
| `delete_product` | Desativar e excluir permanentemente |
| `manage_color` | Gerenciar cores (CRUD completo) |

Todas as permissoes foram adicionadas ao perfil ADMIN em `Roles.php`.

---

## Rotas

### Produtos (`/admin/products`)
| Metodo | URI | Acao | Permissao |
|--------|-----|------|-----------|
| GET | /admin/products | index | list_products |
| GET | /admin/products/create | create | register_product |
| POST | /admin/products | store | register_product |
| GET | /admin/products/{id} | show | list_products |
| GET | /admin/products/{id}/edit | edit | edit_product |
| PUT | /admin/products/{id} | update | edit_product |
| DELETE | /admin/products/{id} | destroy (logico) | delete_product |
| DELETE | /admin/products/{id}/force | forceDestroy | delete_product |
| PUT | /admin/products/{id}/activate | activate | edit_product |
| GET | /admin/products/{id}/variations | variations (JSON) | list_products |
| POST | /admin/products/{productId}/variations | store variation | register_product |
| PUT | /admin/products/{productId}/variations/{id} | update variation | edit_product |
| DELETE | /admin/products/{productId}/variations/{id} | destroy variation | delete_product |

### Cores (`/admin/cores`)
| Metodo | URI | Acao | Permissao |
|--------|-----|------|-----------|
| GET | /admin/cores | index | manage_color |
| GET | /admin/cores/create | create | manage_color |
| POST | /admin/cores | store | manage_color |
| GET | /admin/cores/{id}/edit | edit | manage_color |
| PUT | /admin/cores/{id} | update | manage_color |
| DELETE | /admin/cores/{id} | destroy | manage_color |

### Fotos (`/admin/fotos`)
| Metodo | URI | Acao | Permissao |
|--------|-----|------|-----------|
| GET | /admin/fotos | index | list_products |
| GET | /admin/fotos/create | create | register_product |
| POST | /admin/fotos | store | register_product |
| PUT | /admin/fotos/{id} | update | edit_product |
| DELETE | /admin/fotos/{id} | destroy | delete_product |

---

## Regras de Negocio

### Variacoes por Tipo de Produto
- **ROUPA_ADULTO**: exige `tamanho_roupa_adulto` + `cor`. Proibido `tamanho_calcado` e `tamanho_roupa_crianca`.
- **ROUPA_CRIANCA**: exige `tamanho_roupa_crianca` + `cor`. Proibido `tamanho_calcado` e `tamanho_roupa_adulto`.
- **CALCADO**: exige `tamanho_calcado` + `cor`. Proibido `tamanho_roupa_adulto` e `tamanho_roupa_crianca`.

### Delecao Logica
- Produtos sao desativados (soft delete via campo `active`), nao removidos do banco.
- Produtos desativados aparecem em secao separada na listagem.
- O administrador pode reativar ou excluir permanentemente.

### Slug
- Gerado automaticamente a partir do nome do produto.
- Validacao de unicidade na criacao e atualizacao.

### Fotos
- Upload via Laravel Storage com disco `public`.
- O thumbnail (capa) do produto e selecionado entre as fotos existentes.
- Fotos podem ser vinculadas a variacoes especificas via tabela pivot.

---

## Frontend

### Paginas Criadas

| Pagina | Caminho | Descricao |
|--------|---------|-----------|
| Produtos Index | `resources/js/pages/admin/products/index.tsx` | Listagem paginada com accordion de variacoes |
| Produtos Create | `resources/js/pages/admin/products/create.tsx` | Formulario de criacao com categorias multi-select |
| Produtos Show | `resources/js/pages/admin/products/show.tsx` | Detalhes do produto com fotos |
| Produtos Edit | `resources/js/pages/admin/products/edit.tsx` | Edicao completa com gestao de fotos e variacoes |
| Cores Index | `resources/js/pages/admin/cores/index.tsx` | Listagem paginada com preview de cor |
| Cores Create | `resources/js/pages/admin/cores/create.tsx` | Formulario com color picker |
| Cores Edit | `resources/js/pages/admin/cores/edit.tsx` | Edicao com color picker |
| Fotos Index | `resources/js/pages/admin/fotos/index.tsx` | Listagem por produto com accordion |
| Fotos Create | `resources/js/pages/admin/fotos/create.tsx` | Upload de foto com selecao de produto |

### Sidebar
O menu administrativo foi atualizado com tres novos grupos:
- **Produtos**: Adicionar Produto, Listar Produtos
- **Cores**: Adicionar Cor, Listar Cores
- **Fotos**: Enviar Foto, Listar Fotos

### Componentes Utilizados
- shadcn/ui: Badge, Button, Card, Checkbox, Dialog, Input, Label, Select, Switch, Tooltip
- lucide-react: icones
- Inertia.js: navegacao e formularios

---

## Configuracoes Adicionais

### Bootstrap
- `bootstrap/app.php`: grupo de rotas do ProductManagement registrado
- `bootstrap/providers.php`: ProductManagementServiceProvider registrado

### ServiceProvider
- Binds das 4 interfaces de repositorio para suas implementacoes Eloquent
- Carrega migrations de `../Persistence/Migrations`

---

## Verificacao

- **Pint**: 73 correcoes de estilo aplicadas e validadas
- **Build Vite**: compilacao de producao concluida com sucesso (todos os 9 arquivos frontend compilados)
