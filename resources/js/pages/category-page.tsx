import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/store/product-card';
import CartModal from '@/components/store/cart-modal';

interface Subcategory {
    id: number;
    name: string;
    slug: string;
    productCount: number;
}

interface CategoryData {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    subcategories: Subcategory[];
    productCount: number;
    breadcrumb: { name: string; slug: string }[];
}

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

interface Props {
    category: CategoryData;
    products: StorefrontProduct[];
}

export default function CategoryPage({ category, products }: Props) {
    return (
        <>
            <Head title={`${category.name} | Fabulosa Stores`}>
                <meta name="description" content={category.description || `Explore nossa coleção de ${category.name}`} />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between md:h-20">
                            <Link href="/" className="flex-shrink-0">
                                <h1 className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text md:text-3xl">
                                    FABULOSA
                                </h1>
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="hidden items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-gray-600 dark:text-rose-400 dark:hover:bg-gray-800 md:flex"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="hidden lg:inline">Entrar</span>
                                </Link>
                                <CartModal />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Breadcrumb */}
                <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>
                            <Link href="/" className="hover:text-rose-600 dark:hover:text-rose-400">
                                Início
                            </Link>
                        </li>
                        {category.breadcrumb.map((parent) => (
                            <li key={parent.slug} className="flex items-center space-x-2">
                                <span className="text-gray-400">/</span>
                                <Link
                                    href={`/categoria/${parent.slug}`}
                                    className="hover:text-rose-600 dark:hover:text-rose-400"
                                >
                                    {parent.name}
                                </Link>
                            </li>
                        ))}
                        <li className="flex items-center space-x-2">
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                                {category.name}
                            </span>
                        </li>
                    </ol>
                </nav>

                {/* Category Hero */}
                <section className="relative h-[200px] overflow-hidden md:h-[300px]">
                    {category.image ? (
                        <>
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${category.image})` }}
                                role="img"
                                aria-label={category.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600" />
                    )}
                    <div className="relative container mx-auto flex h-full items-center px-4">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                                {category.name}
                            </h1>
                            <p className="mt-2 text-sm text-gray-200 md:text-base">
                                {category.productCount} produto{category.productCount !== 1 ? 's' : ''} nesta coleção
                            </p>
                        </div>
                    </div>
                </section>

                {/* Subcategories */}
                {category.subcategories.length > 0 && (
                    <section className="container mx-auto px-4 py-6">
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`/categoria/${category.slug}`}
                                className="rounded-full border-2 border-rose-500 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                            >
                                Todos
                            </Link>
                            {category.subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/categoria/${sub.slug}`}
                                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-rose-500 dark:hover:text-rose-400"
                                >
                                    {sub.name}
                                    <span className="ml-1 text-xs text-gray-400">({sub.productCount})</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Products Grid */}
                <section className="container mx-auto px-4 pb-12">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                Nenhum produto encontrado
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Esta coleção ainda não possui produtos disponíveis.
                            </p>
                            <Link
                                href="/"
                                className="mt-6 inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-rose-600 hover:to-pink-600"
                            >
                                Ver todas as coleções
                            </Link>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="border-t border-rose-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-900">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2026 Fabulosa Stores. Todos os direitos reservados.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
