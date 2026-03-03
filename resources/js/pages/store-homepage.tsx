import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/store/product-card';
import CategoryCard from '@/components/store/category-card';
import CartModal from '@/components/store/cart-modal';
import { products, categories, featuredProducts, newProducts } from '@/data/mock-store';

export default function StoreHomepage() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Searching for:', searchTerm);
        // Implement search functionality
        return false;
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Newsletter subscription');
        // Implement newsletter subscription
        return false;
    };

    return (
        <>
            <Head title="Fabulosa Stores | Moda Íntima Feminina - Lingerie, Conjuntos e Mais">
                <meta
                    name="description"
                    content="Descubra nossa coleção exclusiva de lingerie feminina. Conjuntos, sutiãs, calcinhas e moda gestante com elegância, conforto e sensualidade."
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
                                        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-12 text-sm focus:border-[#f53003] focus:outline-none focus:ring-1 focus:ring-[#f53003] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        aria-label="Buscar produtos"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-full bg-[#f53003] p-2 text-white hover:bg-[#d42a02]"
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
                                    className="rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
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
                                    className="hidden items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 md:flex"
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
                                    className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-12 text-sm focus:border-[#f53003] focus:outline-none focus:ring-1 focus:ring-[#f53003] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    aria-label="Buscar produtos"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-full bg-[#f53003] p-2 text-white hover:bg-[#d42a02]"
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
                                <span className="text-[#ff6b6b]">Outono/Inverno</span>
                            </h2>
                            <p className="mb-6 text-lg text-gray-100 md:text-xl">
                                Descubra a beleza em cada detalhe. Peças exclusivas que unem conforto, elegância e sensualidade.
                            </p>
                            <Link
                                href="#produtos"
                                className="inline-block rounded-full bg-[#f53003] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#d42a02]"
                            >
                                Ver Coleção
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="container mx-auto px-4 py-12 md:py-16">
                    <div className="mb-8 text-center md:mb-12">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                            Categorias
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Encontre o estilo perfeito para você
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="bg-white py-12 dark:bg-[#161615] md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between md:mb-12">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                                    Destaques
                                </h2>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    Peças selecionadas especialmente para você
                                </p>
                            </div>
                            <Link
                                href="/produtos"
                                className="hidden items-center gap-1 text-sm font-semibold text-[#f53003] hover:underline md:flex"
                            >
                                Ver todos
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="mt-8 text-center md:hidden">
                            <Link
                                href="/produtos"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#f53003] hover:underline"
                            >
                                Ver todos
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="container mx-auto px-4 py-12 md:py-16">
                    <div className="mb-8 text-center md:mb-12">
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
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

                {/* Newsletter */}
                <section className="bg-[#f53003] py-12 md:py-16">
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
                                className="flex-1 rounded-full border-0 bg-white px-6 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
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
                <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-[#161615]">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            {/* About */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    SOBRE A FABULOSA
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>
                                        <Link href="/sobre" className="hover:text-[#f53003]">
                                            Nossa História
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/carreiras" className="hover:text-[#f53003]">
                                            Carreiras
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/sustentabilidade" className="hover:text-[#f53003]">
                                            Sustentabilidade
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Help */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    AJUDA
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>
                                        <Link href="/faq" className="hover:text-[#f53003]">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/trocas-devolucoes" className="hover:text-[#f53003]">
                                            Trocas e Devoluções
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/prazos-entrega" className="hover:text-[#f53003]">
                                            Prazos de Entrega
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contato" className="hover:text-[#f53003]">
                                            Fale Conosco
                                        </Link>
                                    </li>
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
                                    <div className="h-8 w-12 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                                    REDES SOCIAIS
                                </h3>
                                <div className="flex gap-4">
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-[#f53003] dark:text-gray-400"
                                        aria-label="Instagram"
                                    >
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-[#f53003] dark:text-gray-400"
                                        aria-label="Facebook"
                                    >
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-[#f53003] dark:text-gray-400"
                                        aria-label="Pinterest"
                                    >
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
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
