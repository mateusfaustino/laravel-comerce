export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    promotionalPrice?: number;
    image: string;
    images?: string[];
    category: string;
    subcategory: string;
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
    subcategories?: Subcategory[];
}

export interface Subcategory {
    name: string;
    slug: string;
    productCount?: number;
}

export const products: Product[] = [
    // LINGERIES - Calcinhas
    {
        id: 1,
        name: 'Calcinha básica',
        description: 'Conforto e praticidade para o dia a dia. Tecido macio que respeita sua pele.',
        price: 29.90,
        image: '/images/fabi/products/Calcinha básica/fullsizerender-ff3eb719029bf9a5e717599694285456-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha básica/fullsizerender-ff3eb719029bf9a5e717599694285456-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#F5E6E8', '#FFFFFF', '#000000'],
        sizes: ['P', 'M', 'G'],
        isFeatured: true,
    },
    {
        id: 2,
        name: 'Calcinha de algodão',
        description: 'Algodão 100% respirável com acabamento impecável. Ideal para uso diário.',
        price: 34.90,
        image: '/images/fabi/products/Calcinha de algodão/img_8465-f23c84462b9b8f742f17622960005202-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha de algodão/img_8465-f23c84462b9b8f742f17622960005202-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#F5E6E8', '#FFFFFF'],
        sizes: ['P', 'M', 'G', 'GG'],
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Calcinha de Pala algodão',
        description: 'Design elegante com pala em algodão. Conforto e feminilidade.',
        price: 39.90,
        image: '/images/fabi/products/Calcinha de Pala algodão/fullsizerender-b60f07c790bd32908b17622960638297-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha de Pala algodão/fullsizerender-b60f07c790bd32908b17622960638297-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#F5E6E8', '#FFC0CB'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 4,
        name: 'Calcinha Fio Duplo',
        description: 'Modelagem moderna com fio duplo. Sensação de liberdade total.',
        price: 44.90,
        promotionalPrice: 39.90,
        image: '/images/fabi/products/Calcinha Fio Duplo/img_5828-456682ebbf54305abe17517759431086-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha Fio Duplo/img_5828-456682ebbf54305abe17517759431086-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#000000', '#F5E6E8'],
        sizes: ['P', 'M', 'G'],
        isNew: true,
    },
    {
        id: 5,
        name: 'Calcinha Fio pala',
        description: 'Fio dental com pala estratégica. Sensual e confortável.',
        price: 42.90,
        image: '/images/fabi/products/Calcinha Fio pala/img_2318-d34a00dd795c3a671b17629872075849-640-0.webp',
        images: ['/images/fabi/products/Calcinha Fio pala/img_2318-d34a00dd795c3a671b17629872075849-640-0.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#000000', '#8B4D6B', '#F5E6E8'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 6,
        name: 'Calcinha fio Pala dupla',
        description: 'Design sofisticado com pala dupla. Perfeita para looks justos.',
        price: 46.90,
        image: '/images/fabi/products/Calcinha fio Pala dupla/photoroom_20251008_215146-3a6cbaa69a6c6574fa17599712023927-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha fio Pala dupla/photoroom_20251008_215146-3a6cbaa69a6c6574fa17599712023927-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#000000', '#F5E6E8'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 7,
        name: 'Calcinha Modeladora',
        description: 'Modela as curvas com conforto. Tecnologia de compressão suave.',
        price: 59.90,
        image: '/images/fabi/products/Calcinha Modeladora/img_2699-ae334b00d7ef7c948e17604877139054-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha Modeladora/img_2699-ae334b00d7ef7c948e17604877139054-1024-1024.webp'],
        category: 'Linha Modeladora',
        subcategory: 'Calcinha Modeladora',
        colors: ['#000000', '#F5E6E8'],
        sizes: ['M', 'G', 'GG', 'XGG'],
        isFeatured: true,
    },
    {
        id: 8,
        name: 'Calcinha Modeladora com Renda',
        description: 'Poder modelador com elegância da renda. Une funcionalidade e beleza.',
        price: 64.90,
        promotionalPrice: 54.90,
        image: '/images/fabi/products/Calcinha Modeladora com Renda/img_6654-5a9a5e7d47d9133b7017604877685792-640-0.webp',
        images: ['/images/fabi/products/Calcinha Modeladora com Renda/img_6654-5a9a5e7d47d9133b7017604877685792-640-0.webp'],
        category: 'Linha Modeladora',
        subcategory: 'Calcinha Modeladora com Renda',
        colors: ['#000000', '#8B4D6B'],
        sizes: ['M', 'G', 'GG'],
        isNew: true,
    },
    {
        id: 9,
        name: 'Calcinha Palinha com Renda',
        description: 'Renda delicada na palinha. Toque especial para momentos únicos.',
        price: 49.90,
        image: '/images/fabi/products/Calcinha Palinha com Renda/img_2320-2d76c73f7a616d00d417629872980158-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha Palinha com Renda/img_2320-2d76c73f7a616d00d417629872980158-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#F5E6E8', '#000000', '#FFC0CB'],
        sizes: ['P', 'M', 'G'],
    },
    {
        id: 10,
        name: 'Calcinha Sem Costura FP',
        description: 'Sem costuras para não marcar. Invisível sob a roupa.',
        price: 52.90,
        image: '/images/fabi/products/Calcinha Sem Costura FP/img_1130-1658636c7f34a4109217629870401535-1024-1024.webp',
        images: ['/images/fabi/products/Calcinha Sem Costura FP/img_1130-1658636c7f34a4109217629870401535-1024-1024.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#F5E6E8', '#000000'],
        sizes: ['P', 'M', 'G', 'GG'],
    },
    {
        id: 11,
        name: 'Fio de Renda',
        description: 'Renda francesa sofisticada. Sensualidade pura.',
        price: 54.90,
        image: '/images/fabi/products/Fio de Renda/img_1423-a2b58218200e1d0ab317629878392968-640-0.webp',
        images: ['/images/fabi/products/Fio de Renda/img_1423-a2b58218200e1d0ab317629878392968-640-0.webp'],
        category: 'Lingerie',
        subcategory: 'Calcinhas',
        colors: ['#000000', '#8B4D6B', '#FFC0CB'],
        sizes: ['P', 'M', 'G'],
        isFeatured: true,
    },

    // LINGERIES - Sutiãs
    {
        id: 12,
        name: 'Sutiã com alça removível reforçado',
        description: 'Alças removíveis para versatilidade. Bojo reforçado para sustentação.',
        price: 89.90,
        image: '/images/fabi/products/Sutiã com alça removível reforçado/img_5682-a08b577101b24b69df17601144161190-640-0.webp',
        images: ['/images/fabi/products/Sutiã com alça removível reforçado/img_5682-a08b577101b24b69df17601144161190-640-0.webp'],
        category: 'Lingerie',
        subcategory: 'Sutiãs',
        colors: ['#F5E6E8', '#000000', '#FFFFFF'],
        sizes: ['P', 'M', 'G', 'GG'],
        isFeatured: true,
    },
    {
        id: 13,
        name: 'Sutiã Top com bojo maleável e sem arco',
        description: 'Bojo maleável sem arco. Conforto excepcional para o dia a dia.',
        price: 94.90,
        promotionalPrice: 79.90,
        image: '/images/fabi/products/Sutiã Top com bojo maleável e sem arco/img_3146-8093903fb4354b75bf17600651365869-640-0.webp',
        images: ['/images/fabi/products/Sutiã Top com bojo maleável e sem arco/img_3146-8093903fb4354b75bf17600651365869-640-0.webp'],
        category: 'Lingerie',
        subcategory: 'Sutiãs',
        colors: ['#F5E6E8', '#000000', '#FFFFFF'],
        sizes: ['P', 'M', 'G', 'GG'],
        isNew: true,
    },
    {
        id: 14,
        name: 'Sutiã de amamentação',
        description: 'Prático para amamentação. Abertura fácil com uma mão só.',
        price: 99.90,
        image: '/images/fabi/products/Sutiã de amamentação/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp',
        images: ['/images/fabi/products/Sutiã de amamentação/img_2687-c3e01658f9aa1a6bb917629933311122-640-0.webp'],
        category: 'Moda Gestante',
        subcategory: 'Sutiã de amamentação',
        colors: ['#F5E6E8', '#FFFFFF'],
        sizes: ['M', 'G', 'GG', 'XGG'],
        isFeatured: true,
    },
    {
        id: 15,
        name: 'Sutiã de Amamentação com Renda',
        description: 'Elegância da renda na amamentação. Funcional e bonito.',
        price: 109.90,
        image: '/images/fabi/products/Sutiã de Amamentação com Renda/img_6647-e7c9161ed5bfb0adfb17629935339588-640-0.webp',
        images: ['/images/fabi/products/Sutiã de Amamentação com Renda/img_6647-e7c9161ed5bfb0adfb17629935339588-640-0.webp'],
        category: 'Moda Gestante',
        subcategory: 'Sutiã de Amamentação com Renda',
        colors: ['#F5E6E8', '#FFFFFF'],
        sizes: ['M', 'G', 'GG'],
        isNew: true,
    },

    // Linha Noite
    {
        id: 16,
        name: 'Baby doll Starjane',
        description: 'Baby doll elegante da linha Starjane. Noites especiais merecem peças únicas.',
        price: 189.90,
        promotionalPrice: 159.90,
        image: '/images/fabi/products/Baby doll Starjane/img_4287-a9f5d08793eff731e317629910121538-640-0.webp',
        images: ['/images/fabi/products/Baby doll Starjane/img_4287-a9f5d08793eff731e317629910121538-640-0.webp'],
        category: 'Linha Noite',
        subcategory: 'Baby doll',
        colors: ['#000000', '#8B0000'],
        sizes: ['P', 'M', 'G'],
        isFeatured: true,
    },
    {
        id: 17,
        name: 'Camisola Starjane',
        description: 'Camisola sofisticada da linha Starjane. Elegância para dormir.',
        price: 199.90,
        image: '/images/fabi/products/Camisola Starjane/img_0139-2b5be2e0203319ffa817629908767685-640-0.webp',
        images: ['/images/fabi/products/Camisola Starjane/img_0139-2b5be2e0203319ffa817629908767685-640-0.webp'],
        category: 'Linha Noite',
        subcategory: 'Camisola',
        colors: ['#000000', '#8B0000'],
        sizes: ['P', 'M', 'G', 'GG'],
    },
    {
        id: 18,
        name: 'Baby doll de amamentar',
        description: 'Baby doll prático para amamentação. Acesso fácil sem abrir mão do estilo.',
        price: 169.90,
        image: '/images/fabi/products/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp',
        images: ['/images/fabi/products/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp'],
        category: 'Moda Gestante',
        subcategory: 'Baby doll de amamentar',
        colors: ['#F5E6E8', '#FFC0CB'],
        sizes: ['M', 'G', 'GG'],
        isFeatured: true,
    },
    {
        id: 19,
        name: 'Camisola de amamentar',
        description: 'Camisola com abertura para amamentação. Conforto e praticidade.',
        price: 179.90,
        promotionalPrice: 149.90,
        image: '/images/fabi/products/Camisola de amamentar/img_8320-6d9970794752fb807c17629929268445-1024-1024.webp',
        images: ['/images/fabi/products/Camisola de amamentar/img_8320-6d9970794752fb807c17629929268445-1024-1024.webp'],
        category: 'Moda Gestante',
        subcategory: 'Camisola de amamentar',
        colors: ['#F5E6E8', '#FFC0CB'],
        sizes: ['M', 'G', 'GG'],
        isNew: true,
    },

    // Robes
    {
        id: 20,
        name: 'Roby para camisola',
        description: 'Robe complementar para camisola. Conjunto perfeito para noites especiais.',
        price: 149.90,
        image: '/images/fabi/products/Roby para camisola/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp',
        images: ['/images/fabi/products/Roby para camisola/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp'],
        category: 'Robes',
        subcategory: 'Roby',
        colors: ['#000000', '#8B0000'],
        sizes: ['Único'],
    },
];

export const categories: Category[] = [
    {
        id: 1,
        name: 'Lingerie',
        slug: 'lingerie',
        image: '/images/fabi/products/Calcinha Fio Duplo/img_5828-456682ebbf54305abe17517759431086-1024-1024.webp',
        productCount: 11,
        description: 'Peças íntimas que unem conforto, sensualidade e elegância',
        subcategories: [
            { name: 'Calcinhas', slug: 'calcinhas', productCount: 9 },
            { name: 'Sutiãs', slug: 'sutias', productCount: 2 },
        ],
    },
    {
        id: 2,
        name: 'Linha Modeladora',
        slug: 'linha-modeladora',
        image: '/images/fabi/products/Calcinha Modeladora/img_2699-ae334b00d7ef7c948e17604877139054-1024-1024.webp',
        productCount: 2,
        description: 'Modelagem perfeita para realçar suas curvas com conforto',
        subcategories: [
            { name: 'Calcinha Modeladora', slug: 'calcinha-modeladora', productCount: 1 },
            { name: 'Calcinha Modeladora com Renda', slug: 'calcinha-modeladora-renda', productCount: 1 },
        ],
    },
    {
        id: 3,
        name: 'Linha Noite',
        slug: 'linha-noite',
        image: '/images/fabi/products/Baby doll Starjane/img_4287-a9f5d08793eff731e317629910121538-640-0.webp',
        productCount: 2,
        description: 'Peças sofisticadas para noites inesquecíveis',
        subcategories: [
            { name: 'Baby doll', slug: 'baby-doll', productCount: 1 },
            { name: 'Camisola', slug: 'camisola', productCount: 1 },
        ],
    },
    {
        id: 4,
        name: 'Moda Gestante',
        slug: 'moda-gestante',
        image: '/images/fabi/products/Baby doll de amamentar/img_5736-0c16fefc3609bb672c17629930657573-640-0.webp',
        productCount: 4,
        description: 'Peças especiais para a fase mais bonita da mulher',
        subcategories: [
            { name: 'Baby doll de amamentar', slug: 'baby-doll-amamentar', productCount: 1 },
            { name: 'Camisola de amamentar', slug: 'camisola-amamentar', productCount: 1 },
            { name: 'Sutiã de amamentação', slug: 'sutia-amamentacao', productCount: 1 },
            { name: 'Sutiã de Amamentação com Renda', slug: 'sutia-amamentacao-renda', productCount: 1 },
        ],
    },
    {
        id: 5,
        name: 'Robes',
        slug: 'robes',
        image: '/images/fabi/products/Roby para camisola/img_8320-2619df32cdcc2aa37917629931756374-640-0.webp',
        productCount: 1,
        description: 'Complementos perfeitos para compor looks especiais',
        subcategories: [
            { name: 'Roby', slug: 'roby', productCount: 1 },
        ],
    },
];

export const featuredProducts = products.filter(p => p.isFeatured);
export const newProducts = products.filter(p => p.isNew);
export const lingerieProducts = products.filter(p => p.category === 'Lingerie');
export const nightLineProducts = products.filter(p => p.category === 'Linha Noite');
export const maternityProducts = products.filter(p => p.category === 'Moda Gestante');
