<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
O módulo de CategoryManagement funcionará assim:

No menu administrativo haverá a opção categorias com submenus 'Adicionar Categorias' e Listar Categorias.

Ao clicar em Listar Categorias, haverá uma tabela paginada com todas as cotegorias. Ao clicar em uma delas haverá uma página de detalhes onde se pode editar uma categoria específica. No futuro, quando o módulo de produtos estiver impementado, haverá a lista de produtos com aquela categoria.

O usuário que tiver a permission 'list_categories', pode listar categorias
O usuário que tiver a permission 'register_category' pode cadastrar categorias.
O usuário que tiver a permission 'edit_category' pode editar categorias.
O usuário que tiver a permission 'order_category' pode organizar categorias em hierarquia (pai/filhas).
O usuário que tiver a permission 'delete_category' pode deletar categoria (Deleção lógica)

A Tabela de categorias deve seguir o scheema descrito em docs\scheemas\category.md.


</context>

<goal>
 Criar o módulo de CategoryManagement
</goal>

<instructions>
  1. Implemente o módulo CategoryManagement;
  2. Documente a implementação no arquivo docs\changelog\04_category_management\04_category_management_module\implementação.md
</instructions>


<rules>
  - No frontend siga as diretrizes das 10 Heurísticas de nielsen descritas nos arquivos da pasta docs\diretrizes\heuristics
  - No backend siga as diretrizes do arquivo docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md
  - Seguir SOLID, Clean Code e PSR-12 (em PHP) ou padrões equivalentes.
  - Garantir segurança contra vulnerabilidades comuns (OWASP Top 10).
  - Estruturar em camadas (Controller, Service, Repository).
</rules>

<tone>
  Direto e profissional.
</tone>
