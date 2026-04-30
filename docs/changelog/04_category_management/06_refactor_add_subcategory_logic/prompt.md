<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
  No módulo de CategoryManagement funcionará assim:
  Haverá dois tipos de categorias: categoria e sub-categoria.
  Se o campo parent_id da tabela categories for null, o sistema o reconhecerá como Categoria.

  Caso o campo parent_id da tabela categories não for null, o sistema o reconhecerá como sub-categoria.

  Nas telas de criação e edição da categoria Haverá um campo onde o usuário poderá marcar se aquela será uma categoria ou uma sub-categoria.

  Se ele marcar categoria, o campo categoria Pai ficará hidden. Além disso averá a opções de adicionar sub-categorias àquela categria.

  Se ele marcar sub-categoria, o campo categoria Pai ficará visível. O usuário poderá marcar como categoria pai apenas as categorias cujo o campo parent_id da tabela categories não for null (não mostrar as sub-categorias entre as opções)


</context>

<goal>
  Refatorar o módulo de CategoryManagement, para se adaptar às novas regras de negócio
</goal>

<instructions>
  1. Utilizando-se das boas práticas de programação e das diretrizes do DDD presentesa em docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md e Refatore o módulo CategoryManagement para se adptar às novas regras;
  
  2. Documente a implementação no arquivo docs\changelog\04_category_management\06_refactor_add_subcategory_logic\implementação.md
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
