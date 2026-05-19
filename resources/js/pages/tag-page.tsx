import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/store/product-card';
import CartModal from '@/components/store/cart-modal';
import SearchBar from '@/components/store/search-bar';

interface StorefrontProduct {
    id: number;
    nome: string;
    slug: string;
    price: string | null;
    promotionalPrice: string | null;
    image: string | null;
    categoryName: string | null;
    colors: { nome: string; codRgb: string }[];
    sizes: string[];
    isNew: boolean;
    isFeatured: boolean;
}

interface TagInfo {
    id: number;
    description: string;
}

interface Props {
    tag: TagInfo;
    products: StorefrontProduct[];
}

function toTitleCase(value: string): string {
    return value
        .split(' ')
        .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ');
}

export default function TagPage({ tag, products }: Props) {
    const displayName = toTitleCase(tag.description);

    return (
        <>
            <Head title={`Tag: ${displayName} | Fabulosa Stores`}>
                <meta
                    name="description"
                    content={`Produtos com a tag ${displayName} na Fabulosa Stores.`}
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
                            <Link href="/" className="flex-shrink-0">
                                <h1 className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text md:text-3xl">
                                    FABULOSA
                                </h1>
                            </Link>

                            <SearchBar variant="desktop" />

                            <div className="flex items-center gap-2 md:gap-4">
                                <Link
                                    href="/login"
                                    className="hidden items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-gray-600 dark:text-rose-400 dark:hover:bg-gray-800 md:flex"
                                >
                                    Entrar
                                </Link>
                                <CartModal />
                            </div>
                        </div>

                        <SearchBar variant="mobile" />
                    </div>
                </header>

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="container mx-auto px-4 pt-6">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                            <Link href="/" className="hover:text-rose-600 dark:hover:text-rose-400">
                                Inicio
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>Tag</li>
                        <li aria-hidden="true">/</li>
                        <li className="font-medium text-gray-700 dark:text-gray-200">{displayName}</li>
                    </ol>
                </nav>

                {/* Page Title */}
                <section className="container mx-auto px-4 pt-4 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        Tag: <span className="text-rose-600 dark:text-rose-400">{displayName}</span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {products.length === 0
                            ? 'Nenhum produto com esta tag no momento.'
                            : `${products.length} produto${products.length === 1 ? '' : 's'} encontrado${products.length === 1 ? '' : 's'}.`}
                    </p>
                </section>

                {/* Products grid */}
                <section className="container mx-auto px-4 py-6">
                    {products.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Sua busca nao retornou produtos. Simplifique sua pesquisa para ver outros resultados.
                            </p>
                            <Link
                                href="/"
                                className="mt-4 inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2 text-sm font-medium text-white hover:from-rose-600 hover:to-pink-600"
                            >
                                Voltar para a loja
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
