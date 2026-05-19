<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<issue>
  Ao fazer um Update de produtos com a rota PUT /admin/products/2 o campo tag não é atualizado ao olhar o payload, precebe-se que no campo tags há um array vazio mesmo sendo adicionado um array.
</issue>

<goal>
  Consertar update de produto
</goal>


<instructions>

1. Entenda a causa do problema e use chain od thought para explicar. Verifique por que o campo tag não está sendo preenchido no payload da requisição PUT /admin/products/2 mesmo o usuário digitando a tag.

2. Conserte o problema. 

3. Documente a implementação no arquivo docs\changelog\05_product_management\11_fix_tags_sistem_in_product_update\implementação.md. Nesse arquivo escreva o comando de commit com uma boa mensagem conforme as boas práticas. Além disso liste todos os comandos necessários para aplicar as mudanças.

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
