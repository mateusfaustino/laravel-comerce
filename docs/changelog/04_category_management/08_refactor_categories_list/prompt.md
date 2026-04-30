<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>

A refatoração na rota /admin/categories deve funcionar assim:
  Na rota /admin/categories no primeiro momento só devem aparecer As categorias e não as subcategorias. Além disso devem aparecer apenas as categorias ativas.

  Deve haver algum tipo de accordeon. Ao clicar na categoria, deve aparecer, de forma paginada as subcategorias pertencentes àquela categoria. 

</context>

<goal>
  Refatorar o módulo de CategoryManagement, para se adaptar às novas regras de negócio
</goal>


<instructions>
  1. Aplique a refatoração na rota /admin/categories:
  
  2. Documente a implementação no arquivo docs\changelog\04_category_management\08_refactor_categories_list\implementação.md. No mesmo arquivo dê sugestões de mensagem para o commit usando boas práticas de Git.
  
</instructions>


<rules>
  - No frontend siga as diretrizes das 10 Heurísticas de nielsen descritas nos arquivos da pasta docs\diretrizes\heuristics
  - No frontend, use o Mobile First.
  - No backend siga as diretrizes do arquivo docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md
  - Seguir SOLID, Clean Code e PSR-12 (em PHP) ou padrões equivalentes.
  - Garantir segurança contra vulnerabilidades comuns (OWASP Top 10).
  - Estruturar em camadas (Controller, Service, Repository).
</rules>

<tone>
  Direto e profissional.
</tone>
