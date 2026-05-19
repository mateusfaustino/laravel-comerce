<role>
  Engenheiro de Software Fullstack especializado em PHP, React, DDD, Arquitetura monolítica modular.
</role>

<context>
# Mecanismo de Tags em Sistemas de E-commerce

## Definição Conceitual

O mecanismo de tags consiste em um sistema de classificação semântica baseado em metadados textuais associados a entidades de domínio, permitindo indexação flexível, categorização contextual e recuperação eficiente de informação.

Em sistemas de e-commerce, tags representam palavras-chave descritivas vinculadas aos produtos com o objetivo de melhorar:

* encontrabilidade (findability);
* experiência de busca;
* navegação exploratória;
* filtragem contextual;
* recomendação de itens;
* indexação semântica.

Diferentemente de categorias tradicionais, que geralmente possuem estrutura hierárquica rígida, tags operam sob um modelo não hierárquico e altamente flexível, permitindo múltiplas associações semânticas entre produtos e atributos contextuais.

---

# Fundamentação Teórica

Na literatura de Engenharia de Software, Arquitetura da Informação e Information Retrieval, esse mecanismo é frequentemente associado aos conceitos de:

* Folksonomy;
* Metadata Classification;
* Semantic Indexing;
* Faceted Navigation;
* Search Optimization;
* Many-to-Many Relationship Modeling.

O modelo é amplamente utilizado em:

* marketplaces;
* sistemas CMS;
* plataformas de streaming;
* redes sociais;
* catálogos digitais;
* mecanismos de busca internos.

---

# Estrutura Relacional

O relacionamento entre produtos e tags caracteriza um relacionamento do tipo Many-to-Many (N:N).

Formalmente:

* um produto pode possuir múltiplas tags;
* uma tag pode estar associada a múltiplos produtos.

Esse relacionamento exige uma tabela associativa intermediária.

## Schema relacional

```sql
table tags {
    id: <<PK>>
    description: varchar(255) NOT NULL
}

table produtos_tags {
    id: <<PK>>
    id_product: <<FK>>
    id_tag: <<FK>>
}
```

---

# Papel das Tags no Sistema

As tags funcionam como metadados semânticos que ampliam os pontos de recuperação de informação do produto.

Exemplo:

Produto:

* “Camisa Masculina Oversized Preta”

Possíveis tags:

* oversized
* streetwear
* preta
* casual
* algodão
* urbana

Mesmo que o usuário não conheça a categoria oficial do produto, ele pode encontrá-lo através de associações semânticas derivadas das tags.

---

# Diferença entre Categorias e Tags

## Categorias

* Estrutura hierárquica;
* Taxonomia rígida;
* Organização estrutural do catálogo;
* Navegação primária.

Exemplo:

* Masculino > Camisas > Casuais

## Tags

* Estrutura não hierárquica;
* Associação flexível;
* Navegação contextual;
* Descoberta semântica.

Exemplo:

* oversized
* minimalista
* verão
* streetwear

---

# Folksonomia

O mecanismo de tags é frequentemente associado ao conceito de Folksonomy.

Folksonomia é um modelo de classificação colaborativa baseado em palavras-chave livres definidas por usuários ou administradores do sistema.

Características:

* descentralização semântica;
* flexibilidade classificatória;
* adaptação ao comportamento do usuário;
* evolução orgânica do vocabulário.

---

# Recuperação de Informação (Information Retrieval)

No contexto de mecanismos de busca internos, as tags desempenham papel relevante na recuperação de informação.

Elas contribuem para:

## Recall

Capacidade do sistema recuperar mais resultados potencialmente relevantes.

## Precision

Capacidade do sistema retornar resultados semanticamente mais próximos da intenção do usuário.

## Relevância contextual

Melhoria do ranking e ordenação dos resultados de busca.

---

# Navegação Multifacetada (Faceted Navigation)

Tags também podem ser utilizadas como facetas de filtragem dinâmica.

Exemplo:

* cor;
* estilo;
* ocasião;
* material;
* modelagem.

Isso permite que o usuário refine progressivamente os resultados sem depender exclusivamente da navegação hierárquica.

---

# Aspectos Arquiteturais

## Normalização

A modelagem segue princípios clássicos de normalização relacional:

* eliminação de redundância;
* reutilização de entidades;
* integridade referencial.

---

# Restrições recomendadas

## Evitar duplicidade semântica

```sql
UNIQUE(description)
```

---

## Evitar duplicidade de associação

```sql
UNIQUE(id_product, id_tag)
```

---

## Índices para performance

```sql
INDEX(id_product)
INDEX(id_tag)
INDEX(description)
```

---

# Problemas Clássicos

A literatura aponta desafios recorrentes em sistemas de tagging.

## Ambiguidade semântica

Exemplo:

* “social”

Pode significar:

* roupa social;
* contexto social.

---

## Duplicidade lexical

Exemplo:

* oversized
* over sized
* oversize

---

## Explosão de vocabulário

Crescimento descontrolado de tags reduz:

* consistência;
* precisão da busca;
* qualidade semântica.

---

# Estratégias Recomendadas

## Normalização textual

* lowercase;
* trim;
* remoção de caracteres especiais;
* slugificação;
* remoção de duplicidade.

---

## Vocabulário controlado

O sistema pode operar em:

* modelo livre;
* modelo controlado;
* modelo híbrido.

---

## Sugestão automática

Autocomplete baseado em tags existentes reduz inconsistências e melhora usabilidade.

---

# Possíveis Evoluções

## Inteligência Artificial

Uso de NLP/LLMs para:

* geração automática de tags;
* inferência semântica;
* classificação contextual.

---

## Relevância ponderada

Tags podem possuir:

* score;
* frequência;
* peso semântico;
* taxa de conversão.

---

# Considerações em DDD

No contexto de Domain-Driven Design:

* Tags podem ser modeladas como entidades reutilizáveis;
* Produtos agregam múltiplas associações semânticas;
* A relação produto-tag representa uma associação contextual do domínio.

A entidade Tag normalmente possui:

* identidade própria;
* reutilização transversal;
* ciclo de vida independente.

---

# Conclusão

O mecanismo de tags representa uma estratégia de indexação semântica flexível amplamente consolidada na Engenharia de Software moderna.

Sua principal finalidade é ampliar a capacidade de descoberta, recuperação e organização contextual da informação, especialmente em ambientes de e-commerce com grande variedade de produtos e múltiplas intenções de busca por parte dos usuários.



Assim será a funcionalidade de tags:
Este é o schema da funcionalidade de tags:
```
table tags {
    id: <<PK>>
    description: varchar(255) NOT NULL
}

table produtos_tags {
    id: <<PK>>
    id_product: <<FK>> para produtos
    id_tag: <<FK>> para tags
}

```
Ao criar ou editar um produto, o usuário pode adicionar ou excluir tags, que são palavras chaves que ajudam o cliente a encontrar aquela peça. 

cada produto pode ter várias tags assim como cada tag pode ser associada à vários pordutos. 
</context>

<goal>
  Criar um sistema de tags para os produtos
</goal>


<instructions>

1. Implemente o sistema de tags;

2. Crie uma opção no menu chamada tags com submenus criar tag e listar tags onde o usuário que tiver a permission "manage_tags" pode visualizar criar ou editar tags. na página de detalhe são mostradas os produtos vinculados à cada tag. Ao criar ou editar uma tag pode-se vincular ou desvincular um produto àquela tag.

3. Documente a implementação no arquivo docs\changelog\05_product_management\10_feat_tags_sistem\implementação.md. Nesse arquivo escreva o comando de commit com uma boa mensagem conforme as boas práticas. Além disso liste todos os comandos necessários para aplicar as mudnaças.

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
