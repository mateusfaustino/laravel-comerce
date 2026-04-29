<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
O sistema deverá ter roles e permissions que podem ser descritos em app\Modules\Authentication\Docs\Scheemas\User_roles_permission.md;

As roles estão descritas em
app\Modules\Authentication\Infrastructure\Config\Roles.php
</context>

<goal>
 Criar um sistema de roles e permissions
</goal>

<instructions>
    1. Com base em app\Modules\Authentication\Docs\Scheemas\User_roles_permission.md crie as migrations apara implementar os roles e permissions, dentro do módulo app\Modules\Authentication.

    2. Crie seeds dentro do módulo app\Modules\Authentication, com base em app\Modules\Authentication\Infrastructure\Config\Roles.php

    3. Dentro do módulo app\Modules\Authentication, crie um comando que ao ser acionado, sincroniza as permissions e roles que estão no arquivo app\Modules\Authentication\Infrastructure\Config\Roles.php. Ou seja, caso haja alguma diferença entre o arquivo e o banco de dados ele atualiza o dados no banco para ficar igual.

    4. Atualize o arquivo app\Modules\Authentication\Infrastructure\Seeders\AuthenticationSeeder.php
    para que ao rodar o sistema crie um usuário para cada role

    5. Documente as mudanças em docs\changelog\01_login\02_roles_permissions\implementação.md



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
