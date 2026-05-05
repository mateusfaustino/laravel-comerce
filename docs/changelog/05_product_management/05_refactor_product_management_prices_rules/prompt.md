<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>

Essas são as mudanças no módulo ProductManagement:

No módulo app\Modules\ProductManagement as informações de preços (Preco de Venda, Preco Promocional, Custo) estão na tabela de produtos.

As regras devem mudar: as informações de preços (Preco de Venda, Preco Promocional, Custo) devem estar na tabela de variação de produtos (produto_variacoes)

Deve-se portanto apagar os campos preco_venda, preco_promocional e custo da tabela produtos e adicionar na tabela produto_variacoes

Além disso, A criação de variações só é possível ao editar o produto. O correto é que se possa adicionar novas variações no ato de criar um novo produto.

Além disso, A adição de fotos só é possível ao editar o produto. O correto é que se possa adicionar adicionar novas fotos no ato de criar um novo produto.
</context>

<goal>
  Aplicar mudanças no módulo ProductManagement
</goal>


<instructions>
1. Aplique as mudanças no módulo ProductManagement;
2. Documente a implementação no arquivo docs\changelog\05_product_management\05_refactor_product_management_prices_rules\implementação.md. Nesse arquivo escreva o comando de commit com uma boa mensagem conforme as boas práticas. Além disso liste todos os comandos necessários para aplicar as mudnaças.

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
