Table users {
    id: <<PK>> 
    name: varchar(255) NOT NULL
    email: varchar(255) NOT NULL
    email_verified_at: timestamp NULL DEFAULT NULL
    password: varchar(255) COLLATE  NOT NULL 
    role_id: <<FK>> para roles
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
    
}

Table roles {
    id: <<PK>> 
    slug: varchar(255) NOT NULL
    name: varchar(255) NOT NULL
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
}

Table roles_permissions {
    id: <<PK>>
    id_role: <<FK>> para roles
    id_permission: <<FK>> para permissions
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
}

Table permissions {
    id: <<PK>>
    slug: varchar(255) NOT NULL
    description: varchar(255) NOT NULL
    created_at: timestamp NULL DEFAULT NULL
    updated_at: timestamp NULL DEFAULT NULL
}

roles e users tem uma relação 1 para muitos,
roles e permissions tem uma relação muitos para muitos
