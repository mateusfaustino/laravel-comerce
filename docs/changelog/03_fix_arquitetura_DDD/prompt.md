<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<issue>
Os módulos app\Modules\AdminPanel e app\Modules\Authentication funcionam porém precisam ser refatorados quanto à Arquitetura DDD. O arquivo docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md é uma documentação sobre as diretrizes de como implementar o DDD no monolito modular
</issue>

<goal>
 Criar um painel administrativo.
</goal>

<instructions>
  1. Leie as diretrizes escritas em docs\diretrizes\DDD\human_diretrizes_DDD_monolito_modular.md;

  2. Use chain of thoughts para entender a estrutura de pastas do Módulo no DDD;

  3. Corrija a estrutura de pastas e refatore os módulos app\Modules\AdminPanel e app\Modules\Authentication;

  4. ducumente as mudanças em docs\changelog\03_fix_arquitetura_DDD\implementação.md

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
