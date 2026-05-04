<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
O módulo de ProductManagement funcionará assim:

No menu administrativo haverá a opção Produtos com submenus 'Adicionar Produto' e Listar Produtos.

Ao clicar em Listar Produtos, haverá um tabela paginada com todas os produtos. Ao clicar em um dos produtos haverá uma página de detalhes onde se pode editar um produto específico.

O usuário que tiver a permission 'list_products', pode listar produtos
O usuário que tiver a permission 'register_product' pode cadastrar produtos.
O usuário que tiver a permission 'edit_product' pode editar produtos.
O usuário que tiver a permission 'delete_product' pode deletar produtos (Deleção lógica)

Cada produto pode ter uma ou mais variação de produto (tabela produto_variacoes)
Cada variação de produto possui uma combinação única dos seguintes parâmetros:

Se o tipo produto for tipo_produto= ROUPA_ADULTO:

tamanho_roupa_adulto: TamanhoRoupaAdulto,
cor.

Se o tipo produto for tipo_produto= ROUPA_CRIANÇA:
tamanho_roupa_crianca: TamanhoRoupaCrianca,
cor.

Se o tipo produto for tipo_produto= CALÇADO:
tamanho_calcado: TamanhoCalcado
cor.

Na rota /admin/products no primeiro momento só devem aparecer Os produtos e não as variação de produto. Além disso devem aparecer apenas os produtos ativos.

Deve haver algum tipo de accordeon. Ao clicar no poduto, deve aparecer, de forma paginada as variações de produtos pertencentes àquele produto. 

Ao cadastrar o produto haverá os campos referentes às tabelas de produto referntes ao docs\scheemas\product.md. Haverá a Lista de caategorias, o usuário poderá escolher uma ou mais categoria ou subcategoria.

Ao cadastrar o produto o usuário poderá enviar uma ou mas fotos para aquele produto. Dentre as fotos que ele enviou, ele poderá escolher uma para ser thumb (capa) do produto.
Para cada foto cadastrada haverá checkbox para escolher em que variação de produtos aquela foto aparecerá.

Deve haver no menu uma opção de Cores com submenus de listar cores e adicionare cor.

O usuário que tiver a permission 'manage_color' pode cadastrar cores, editar cores e vincular cores às variações de produto

As Tabela referentes à esse módulo, deve seguir o scheema descrito em docs\scheemas\product.md.

Deve haver no menu uma opção de Fotos com submenus de listar fotos e adicionare foto.

</context>

<goal>
 Criar o módulo de productManagement
</goal>

<instructions>
  1. Implemente o módulo productManagement;
  2. Documente a implementação no arquivo docs\changelog\05_product_management\01_product_management_module\implementação.md
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
