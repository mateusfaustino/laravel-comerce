import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/store/product-card';
import CartModal from '@/components/store/cart-modal';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    subcategories: { name: string; slug: string }[];
    productCount: number;
}

interface StorefrontProduct {
    id: number;
    nome: string;
    slug: string;
    price: string | null;
    promotionalPrice: string | null;
    image: string | null;
    categoryName: string | null;
    colors: string[];
    sizes: string[];
    isNew: boolean;
    isFeatured: boolean;
}

interface Props {
    categories: Category[];
    featuredProducts: StorefrontProduct[];
    newProducts: StorefrontProduct[];
    categoryProducts: Record<string, StorefrontProduct[]>;
}

export default function StoreHomepage({ categories, featuredProducts, newProducts, categoryProducts }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Searching for:', searchTerm);
        return false;
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Newsletter subscription');
        return false;
    };

    return (
        <>
            <Head title="Fabulosa Stores | Lingerie Feminina - Moda Íntima, Gestante e Linha Noite">
                <meta
                    name="description"
                    content="Descubra nossa coleção exclusiva de lingerie feminina. Calcinhas, sutiãs, moda gestante e linha noite com elegância, conforto e sensualidade."
                />
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
                        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0">
                                <h1 className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text md:text-3xl">
                                    FABULOSA
                                </h1>
                            </Link>

                            {/* Search Bar - Desktop */}
                            <form
                                onSubmit={handleSearch}
                                onReset={handleSearch}
                                className="hidden flex-1 max-w-xl md:block"
                                noValidate
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar produtos..."
                                        className="w-full rounded-full border border-rose-200 bg-rose-50 py-2.5 pl-4 pr-12 text-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        aria-label="Buscar produtos"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-rose-500 to-pink-500 p-2 text-white hover:from-rose-600 hover:to-pink-600"
                                        aria-label="Buscar"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* Actions */}
                            <div className="flex items-center gap-2 md:gap-4">
                                {/* Mobile Search */}
                                <button
                                    className="rounded-full p-2 text-gray-700 hover:bg-rose-50 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
                                    aria-label="Buscar"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>

                                {/* User Account */}
                                <Link
                                    href="/login"
                                    className="hidden items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-gray-600 dark:text-rose-400 dark:hover:bg-gray-800 md:flex"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="hidden lg:inline">Entrar</span>
                                </Link>

                                {/* Cart */}
                                <CartModal />
                            </div>
                        </div>

                        {/* Mobile Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            onReset={handleSearch}
                            className="pb-4 md:hidden"
                            noValidate
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar produtos..."
                                    className="w-full rounded-full border border-rose-200 bg-rose-50 py-2.5 pl-4 pr-12 text-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    aria-label="Buscar produtos"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-rose-500 to-pink-500 p-2 text-white hover:from-rose-600 hover:to-pink-600"
                                    aria-label="Buscar"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </header>

                {/* Hero Banner */}
                <section className="relative h-[500px] overflow-hidden md:h-[600px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('/images/fabi/ChatGPT Image 3 de mar. de 2026, 16_57_50.png')",
                        }}
                        role="img"
                        aria-label="Coleção de lingerie elegante"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
                    <div className="relative container mx-auto flex h-full items-center px-4">
                        <div className="max-w-xl text-white">
                            <h2 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                                Nova Coleção
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                                    Outono/Inverno
                                </span>
                            </h2>
                            <p className="mb-6 text-lg text-gray-100 md:text-xl">
                                Descubra a beleza em cada detalhe. Peças exclusivas que unem conforto, elegância e sensualidade.
                            </p>
                            <Link
                                href="#categorias"
                                className="inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl"
                            >
                                Ver Coleção
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories by Department */}
                <section id="categorias" className="container mx-auto px-4 py-12 md:py-16">
                    <div className="mb-12 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                            Nossas Coleções
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Explore nossas categorias e encontre o estilo perfeito para você
                        </p>
                    </div>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
                                >
                                    <Link href={`/categoria/${category.slug}`}>
                                        <div className="aspect-[4/3] overflow-hidden">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                                                    <span className="text-4xl font-bold text-rose-300 dark:text-gray-500">
                                                        {category.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-sm text-gray-200 mb-3">
                                                {category.productCount} produto{category.productCount !== 1 ? 's' : ''}
                                            </p>
                                            {category.subcategories.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {category.subcategories.map((sub) => (
                                                        <span
                                                            key={sub.slug}
                                                            className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm"
                                                        >
                                                            {sub.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Nenhuma categoria disponível no momento.
                        </p>
                    )}
                </section>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="bg-gradient-to-b from-white to-rose-50 py-12 dark:from-gray-900 dark:to-gray-800 md:py-16">
                        <div className="container mx-auto px-4">
                            <div className="mb-12 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                                    Destaques
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Peças selecionadas especialmente para você
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* New Arrivals */}
                {newProducts.length > 0 && (
                    <section className="container mx-auto px-4 py-12 md:py-16">
                        <div className="mb-12 text-center">
                            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                                Lançamentos
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                As novidades que você estava esperando
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {newProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Products by Category */}
                {Object.entries(categoryProducts).map(([categoryName, products]) => (
                    <section
                        key={categoryName}
                        className="bg-gradient-to-b from-pink-50 to-white py-12 dark:from-gray-800 dark:to-gray-900 md:py-16"
                    >
                        <div className="container mx-auto px-4">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {categoryName}
                                </h2>
                                {categories.find((c) => c.name === categoryName) && (
                                    <Link
                                        href={`/categoria/${categories.find((c) => c.name === categoryName)!.slug}`}
                                        className="text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                                    >
                                        Ver todos →
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                {/* Newsletter */}
                <section className="bg-gradient-to-r from-rose-500 to-pink-500 py-12 md:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                            Fique por dentro das novidades
                        </h2>
                        <p className="mb-6 text-white/90 md:text-lg">
                            Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão
                        </p>
                        <form
                            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                            onSubmit={handleNewsletterSubmit}
                            onReset={handleNewsletterSubmit}
                            noValidate
                        >
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 rounded-full border-0 bg-white px-6 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                aria-label="E-mail para newsletter"
                            />
                            <button
                                type="submit"
                                className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                            >
                                Cadastrar
                            </button>
                        </form>
                        <p className="mt-4 text-xs text-white/70">
                            Ao se cadastrar, você concorda com nossos Termos e Política de Privacidade
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-rose-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            {/* About */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    SOBRE A FABULOSA
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li><Link href="/sobre" className="hover:text-rose-600 dark:hover:text-rose-400">Nossa História</Link></li>
                                    <li><Link href="/carreiras" className="hover:text-rose-600 dark:hover:text-rose-400">Carreiras</Link></li>
                                    <li><Link href="/sustentabilidade" className="hover:text-rose-600 dark:hover:text-rose-400">Sustentabilidade</Link></li>
                                </ul>
                            </div>

                            {/* Help */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    AJUDA
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li><Link href="/faq" className="hover:text-rose-600 dark:hover:text-rose-400">FAQ</Link></li>
                                    <li><Link href="/trocas-devolucoes" className="hover:text-rose-600 dark:hover:text-rose-400">Trocas e Devoluções</Link></li>
                                    <li><Link href="/prazos-entrega" className="hover:text-rose-600 dark:hover:text-rose-400">Prazos de Entrega</Link></li>
                                    <li><Link href="/contato" className="hover:text-rose-600 dark:hover:text-rose-400">Fale Conosco</Link></li>
                                </ul>
                            </div>

                            {/* Payment */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    FORMAS DE PAGAMENTO
                                </h3>
                                <div className="flex gap-2">
                                    <div className="h-8 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                                    <div className="h-8 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                                    <div className="h-8 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    REDES SOCIAIS
                                </h3>
                                <div className="flex gap-4">
                                    <a href="#" className="text-gray-600 hover:text-rose-600 dark:text-gray-400" aria-label="Instagram">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-rose-200 pt-8 dark:border-gray-700">
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                © 2026 Fabulosa Stores. Todos os direitos reservados.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
