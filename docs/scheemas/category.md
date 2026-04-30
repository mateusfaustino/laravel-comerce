Table categorias {
    id: <<PK>> 
    nome: varchar(255) NOT NULL
    slug: varchar(255) NOT NULL
    categoria_parent: <<FK>> para categorias
    active: Bool
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
}



