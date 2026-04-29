<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
Haverá um modúlo chamado AdminPanel que administrará o painel onde o admin se loga. Funcionará assim:
Se o usuário tiver a permissão access_admin_panel, ele será direcionado para um Painel administrativo. A rota para isso será admin/dashboard. todas as rotas que começam por admin/ deverá ser protegida por um middleware que verifica se o usuário tem algum role que possui a permission access_admin_panel. Caso contrário será direcionado para uma página personalizada informando que a página não existe, com um botão, voltar para a loja que o direcionará para o home da loja. Por enquanto no dashboard deverá ter apenas uma mensagem dizendo "Você está logado"
</context>

<goal>
 Criar um painel administrativo.
</goal>

<instructions>
    1. Crie o módulo AdminPanel com as funcionalidades descritas.

    2. Documente o que foi feito em docs\changelog\02_admin_panel\01_admin_panel_module\implementação.md em português.

</instructions>


<rules>
  - No frontend siga as diretrizes das 10 Heurísticas de nielsen descritas nos arquivos da pasta docs\diretrizes\heuristics
  - No backend siga as diretrizes do arquivo docs\diretrizes\DDD\AI_diretrizes_DDD_monolito_modular.md
  - Seguir SOLID, Clean Code e PSR-12 (em PHP) ou padrões equivalentes.
  - Garantir segurança contra vulnerabilidades comuns (OWASP Top 10).
  - Estruturar em camadas (Controller, Service, Repository).
</rules>

<tone>
  Direto e profissional.
</tone>
