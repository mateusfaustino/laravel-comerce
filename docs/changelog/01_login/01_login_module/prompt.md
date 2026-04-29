<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
 O sistema deve seguir a Arquiterua de Monolito Moduldar e o Domain Driven Design
</context>

<goal>
  Refatorar a lógica já existente de login em DDD
</goal>

<instructions>
    1. Leia as diretrizes do arquivo docs\diretrizes\DDD e implemente o módulo de /Authentication onde estará toda a lógica de autenticação.

    2. Transfira os arquivos de migration referentes à login ao módulo de /Authentication.
    
    3. Crie arquivos de seed dentro do módulo de /Authentication, nesse arquivo crie 2 usuários. 
    
    4. Em um contexto geral do sistema crie um arquivo com todos os comandos para executar todas as migrations, inclusive as dos módulos. Use boas práticas para nomear este arquivo e decidir em que pasta estará.
    
    5. Em um contexto geral do sistema crie um arquivo com todos os comandos para executar todas as seeds, inclusive as dos módulos. Use boas práticas para nomear este arquivo e decidir em que pasta estará.
    
    5. Implemente o Frontend da rota de /login

</instructions>

<output>
  Código PHP pronto para colar no projeto.
</output>

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
