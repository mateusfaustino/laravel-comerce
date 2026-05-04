Table produtos {
    id: <<PK>> 
    nome: varchar(255) NOT NULL
    slug: varchar(255) NOT NULL
    descricao: varchar(255)
    preco_venda: decimal
    preco_promocional: decimal
    custo: decimal
    estoque_tipo: EstoqueTipo
    sku: varchar(255)
    codigo_barras: varchar(255)
    peso: decimal
    largura: decimal
    altura: decimal
    comprimento: decimal
    active: Bool
    tipo_produto: TipoProduto
    thumbnail_foto_id: <<FK>> para fotos
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
}

Table produtos_categorias {
    id: <<PK>> 
    product_id: <<FK>> para produtos
    category_id: <<FK>> para categorias
}

Table fotos {
    id: <<PK>>
    path: varchar(255)
    descricao: varchar(255)
    ordem: int
    product_id: <<FK>> para produtos
}

produto_variacoes_fotos{
    id: <<PK>>
    produto_variacao_id: <<FK>> para produto_variacoes
    foto_id: <<FK>> para fotos
}

Table produto_variacoes {
    id: <<PK>> 
    tamanho_roupa_adulto: TamanhoRoupaAdulto
    tamanho_roupa_crianca: TamanhoRoupaCrianca
    tamanho_calcado: TamanhoCalcado
    active: bool
    quantidade_estoque: int
}

Table cor {
    id: <<PK>> 
    nome: varchar(255)
    cod_rgb: varchar(6)
}

Enum TipoProduto {
    ROUPA_ADULTO
    ROUPA_CRIANÇA
    CALÇADO
}
Enum EstoqueTipo {
    INFINITO
    LIMITADO
}

Enum TamanhoRoupaAdulto {
    PP
    P
    M
    G
    GG
    XG
}

Enum TamanhoRoupaCrianca {
    2
    4
    6
    8
    10
    12
    14
}

Enum TamanhoCalcado {
    32
    33
    34
    35
    36
    37
    38
    39
    40
    41
    42
    43
    44
    45
    46
    47
    48
}



