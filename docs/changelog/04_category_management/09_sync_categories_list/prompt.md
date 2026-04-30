<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>

O arquivo app\Modules\CategoryManagement\Infrastructure\Config\DefaultCategories.php contém as categorias padrões do sistema.

</context>

<goal>
  Criar um comando que sincronize as categorias padrões ao banco de dados.
</goal>


<instructions>
  1. Crie um comando que sincronize as categorias padrões descritas em app\Modules\CategoryManagement\Infrastructure\Config\DefaultCategories.php à tabela categories do banco de dados.

  2. Adicione esse comando ao arquivo scripts\sync.sh
  
  3. Documente a implementação no arquivo docs\changelog\04_category_management\09_refactor_categories_list\implementação.md. No mesmo arquivo dê sugestões de mensagem para o commit usando boas práticas de Git.

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
