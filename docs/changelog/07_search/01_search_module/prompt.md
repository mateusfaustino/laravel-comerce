<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>

Assim será o módulo /Search:

quando o usuário começar a digitar na barra de pesquisa as informações devem atualizar em tempo real, na medida em que ele pesquisa.

Na medida em que ele vai digitando, vai aparecendo palavras de produtos e categorias referentes ao que ele está digitando, se ele clicar na palavra da categoria ele será direcionado à página daquela categoria, se clicar na palavra de um produto irá para aquele produto.
abaixo. Aparecerá um limite de 5 palavras.

abaixo das palavras aparecerão produtos referentes à pesquisa, no formato do card, com foto, nome do produto, preço sem desconto riscado, preço com desconto destacado e porcentagem do disconto. Se o usuário clicar no card do produto será direcionado à ele.

Se não encontrar nada haverá uma mensagem dizendo "Sua busca não retornou produtos. Simplifique sua pesquisa para ver outros resultados." com uma seção abaixo com os produtos mais pesquisados.

Haverá uma tabela que registra o histórico dos produtos pesquisados. 

</context>

<goal>
  Refatorar o código para que ele implemente a heurística 8 de Nielsen
</goal>


<instructions>
1. Implemente no módulo front app\Modules\Storefront a heuristica 8 de nielsen. 

2. Documente a implementação no arquivo C:\dev\PHP\laravel-comerce\docs\changelog\06_storefront\05_refactor_heuristc_8\implementação.md. Nesse arquivo escreva o comando de commit com uma boa mensagem conforme as boas práticas. Além disso liste todos os comandos necessários para aplicar as mudnaças.

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
