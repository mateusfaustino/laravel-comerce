export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    promotionalPrice?: number;
    image: string;
    images?: string[];
    category: string;
    colors: string[];
    sizes: string[];
    isNew?: boolean;
    isFeatured?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    productCount?: number;
    description?: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Conjunto Renda Floral Delicate',
        description: 'Conjunto de renda floral com detalhes em dourado. Conforto e elegância para momentos especiais. Bojo removível e alças ajustáveis.',
        price: 189.90,
        promotionalPrice: 159.90,
        image: '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/photoroom_20251008_215146-3a6cbaa69a6c6574fa17599712023927-1024-1024.webp',
        images: [
            '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/photoroom_20251008_215146-3a6cbaa69a6c6574fa17599712023927-1024-1024.webp',
            '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/photoroom_20251008_215214-b41623ef2bc0217add17599712024116-640-0.webp',
        ],
        category: 'Conjuntos',
        colors: ['#F5E6E8', '#000000', '#8B4D6B'],
        sizes: ['P', 'M', 'G', 'GG'],
        isNew: true,
        isFeatured: true,
    },
    {
        id: 2,
        name: 'Body Elegance Noir',
        description: 'Body em renda francesa com acabamento impecável. Perfeito para noites especiais. Fechamento frontal.',
        price: 259.90,
        image: '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp',
        images: [
            '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp',
            '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5737-59d2127ba3cac1f65517629930365148-640-0.webp',
        ],
        category: 'Bodys',
        colors: ['#000000', '#8B0000'],
        sizes: ['P', 'M', 'G'],
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Sutiã Push Up Lace Romance',
        description: 'Sutiã push up com renda delicada e bojo removível. Realça o decote com conforto e sofisticação.',
        price: 129.90,
        promotionalPrice: 99.90,
        image: '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/img_3146-8093903fb4354b75bf17600651365869-640-0.webp',
        images: [
            '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/img_3146-8093903fb4354b75bf17600651365869-640-0.webp',
            '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/img_3147-a7f810c5fdeb72250317600651367243-1024-1024.webp',
        ],
        category: 'Sutiãs',
        colors: ['#F5E6E8', '#FFC0CB', '#FFFFFF'],
        sizes: ['P', 'M', 'G', 'GG'],
        isNew: true,
    },
    {
        id: 4,
        name: 'Calcinha Renda Invisible Comfort',
        description: 'Calcinha em renda invisível sem costura. Conforto absoluto para o dia a dia com toque de sensualidade.',
        price: 49.90,
        image: '/images/fabi/LINGERIES/Calcinhas/Calcinha Fio Duplo/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp',
        images: [
            '/images/fabi/LINGERIES/Calcinhas/Calcinha Fio Duplo/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp',
            '/images/fabi/LINGERIES/Calcinhas/Calcinha Fio Duplo/img_8322-84f57b94ccf09b35c417629931752899-1024-1024.webp',
        ],
        category: 'Calcinhas',
        colors: ['#F5E6E8', '#FFC0CB', '#E8D5C4'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 5,
        name: 'Robe de Seda Luxe Feminino',
        description: 'Robe longo em seda natural com bordados à mão. Toque de luxo e feminilidade para momentos únicos.',
        price: 599.90,
        promotionalPrice: 499.90,
        image: '/images/fabi/Moda Gestante/Roby para camisola/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
        images: [
            '/images/fabi/Moda Gestante/Roby para camisola/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
            '/images/fabi/Moda Gestante/Roby para camisola/img_2688-7eac256a1c4cd1f62417629933309351-1024-1024.webp',
        ],
        category: 'Robes',
        colors: ['#000000', '#8B0000', '#FFD700'],
        sizes: ['Único'],
        isFeatured: true,
    },
    {
        id: 6,
        name: 'Conjunto Bridal Collection Pureté',
        description: 'Conjunto especial para noivas em renda chantilly. Detalhes exclusivos feitos à mão. Pureza e elegância.',
        price: 349.90,
        image: '/images/fabi/Moda Gestante/Sutiã de Amamentação com Renda/img_6983-7a5cf0b049ba39484817629930365148-1024-1024.webp',
        images: [
            '/images/fabi/Moda Gestante/Sutiã de Amamentação com Renda/img_6983-7a5cf0b049ba39484817629930365148-1024-1024.webp',
        ],
        category: 'Conjuntos',
        colors: ['#FFFFFF', '#FFFAF0'],
        sizes: ['P', 'M', 'G'],
        isNew: true,
    },
    {
        id: 7,
        name: 'Baby Doll Sensual Nuit',
        description: 'Baby doll em tule e renda com ajuste no busto. Romântico e sensual na medida certa. Perfeito para noites especiais.',
        price: 179.90,
        image: '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5738-80868d5603c1b2bd8a17629930656018-640-0.webp',
        images: [
            '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5738-80868d5603c1b2bd8a17629930656018-640-0.webp',
        ],
        category: 'Baby Dolls',
        colors: ['#000000', '#8B0000', '#FFC0CB'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 8,
        name: 'Short Cinturado Lace Chic',
        description: 'Short de cintura alta em renda. Peça versátil para compor looks modernos e femininos.',
        price: 89.90,
        promotionalPrice: 69.90,
        image: '/images/fabi/LINGERIES/Calcinhas/Calcinha de Pala algodão/img_6647-e7c9161ed5bfb0adfb17629935339588-640-0.webp',
        images: [
            '/images/fabi/LINGERIES/Calcinhas/Calcinha de Pala algodão/img_6647-e7c9161ed5bfb0adfb17629935339588-640-0.webp',
            '/images/fabi/LINGERIES/Calcinhas/Calcinha de Pala algodão/img_6656-b154da17bf4a3e945017629935339302-1024-1024.webp',
        ],
        category: 'Shorts',
        colors: ['#000000', '#FFFFFF'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 9,
        name: 'Sutiã Amamentação Confort',
        description: 'Sutiã especializado para amamentação com abertura prática. Conforto e funcionalidade para a nova fase.',
        price: 159.90,
        image: '/images/fabi/Moda Gestante/Sutiã de amamentação/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
        images: [
            '/images/fabi/Moda Gestante/Sutiã de amamentação/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
        ],
        category: 'Sutiãs',
        colors: ['#F5E6E8', '#FFFFFF'],
        sizes: ['M', 'G', 'GG'],
        isNew: true,
    },
    {
        id: 10,
        name: 'Calcinha Algodão Soft',
        description: 'Calcinha em algodão respirável com acabamentos suaves. Ideal para uso diário com máximo conforto.',
        price: 39.90,
        image: '/images/fabi/LINGERIES/Calcinhas/Calcinha de algodão/img_8465-f23c84462b9b8f742f17622960005202-1024-1024.webp',
        images: [
            '/images/fabi/LINGERIES/Calcinhas/Calcinha de algodão/img_8465-f23c84462b9b8f742f17622960005202-1024-1024.webp',
        ],
        category: 'Calcinhas',
        colors: ['#F5E6E8', '#FFFFFF', '#E8D5C4'],
        sizes: ['P', 'M', 'G', 'GG'],
    },
];

export const categories: Category[] = [
    {
        id: 1,
        name: 'Conjuntos',
        slug: 'conjuntos',
        image: '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/photoroom_20251008_215146-3a6cbaa69a6c6574fa17599712023927-1024-1024.webp',
        productCount: 45,
        description: 'Conjuntos completos que unem conforto e sensualidade',
    },
    {
        id: 2,
        name: 'Sutiãs',
        slug: 'sutias',
        image: '/images/fabi/LINGERIES/Sutiãs/Sutiã Top com bojo maleável e sem arco/img_3146-8093903fb4354b75bf17600651365869-640-0.webp',
        productCount: 32,
        description: 'Suporte e beleza para todos os momentos',
    },
    {
        id: 3,
        name: 'Calcinhas',
        slug: 'calcinhas',
        image: '/images/fabi/LINGERIES/Calcinhas/Calcinha Fio Duplo/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp',
        productCount: 58,
        description: 'Conforto diário com toque especial',
    },
    {
        id: 4,
        name: 'Moda Gestante',
        slug: 'moda-gestante',
        image: '/images/fabi/Moda Gestante/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp',
        productCount: 24,
        description: 'Peças especiais para essa fase única',
    },
    {
        id: 5,
        name: 'Robes',
        slug: 'robes',
        image: '/images/fabi/Moda Gestante/Roby para camisola/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
        productCount: 12,
        description: 'Elegância e conforto para casa',
    },
    {
        id: 6,
        name: 'Coleção Bridal',
        slug: 'colecao-bridal',
        image: '/images/fabi/Moda Gestante/Sutiã de Amamentação com Renda/img_6983-7a5cf0b049ba39484817629930365148-1024-1024.webp',
        productCount: 8,
        description: 'Lingerie dos sonhos para noivas',
    },
];

export const featuredProducts = products.filter(p => p.isFeatured);
export const newProducts = products.filter(p => p.isNew);
