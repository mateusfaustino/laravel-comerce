<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>

Na rota /admin/categories deve haver uma seção para listar apenas as categorias desativadas. Haverá um botão de exclusão permanente.

Ao clicar nesse botão o usuário será informado da exclusão permanente. Ao confirmar a ação, a categoria e todas as suas subcategorias devem ser deletadas do banco.

</context>

<goal>
  Criar seção de desativados.
</goal>

<instructions>
  1. Aplique a seção de categorias desativadas. 
  
  2. Documente a implementação no arquivo docs\changelog\04_category_management\09_sync_categories_list\implementação.md. No mesmo arquivo dê sugestões de mensagem para o commit usando boas práticas de Git.
  
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
