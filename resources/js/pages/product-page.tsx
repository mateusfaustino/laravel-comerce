import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ProductCard from '@/components/store/product-card';
import CartModal from '@/components/store/cart-modal';
import { products, Product } from '@/data/mock-store';

interface ProductPageProps {
    id: string;
}

export default function ProductPage({ id }: ProductPageProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Convert id from string to number for comparison
    const productId = parseInt(id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produto não encontrado</h1>
                    <Link href="/" className="mt-4 inline-block text-rose-600 hover:text-rose-700">
                        Voltar para a loja →
                    </Link>
                </div>
            </div>
        );
    }

    const similarProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.promotionalPrice!) / product.price) * 100)
        : 0;

    const handleAddToCart = () => {
        console.log('Adding to cart:', {
            product,
            quantity,
            selectedSize,
            selectedColor,
        });
        // TODO: Implement cart functionality
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.visit('/checkout');
    };

    const allImages = product.images || [product.image];

    return (
        <>
            <Head title={`${product.name} | Fabulosa Stores`}>
                <meta name="description" content={product.description} />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between md:h-20">
                            <Link href="/" className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text md:text-3xl">
                                FABULOSA
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link href="/cart" className="relative">
                                    <CartModal />
                                </Link>
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
                        <li className="text-gray-400">/</li>
                        <li>
                            <Link href={`/?categoria=${product.category.toLowerCase()}`} className="hover:text-rose-600 dark:hover:text-rose-400">
                                {product.category}
                            </Link>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
                                <img
                                    src={allImages[selectedImage]}
                                    alt={`${product.name} - vista ${selectedImage + 1}`}
                                    className="h-full w-full object-cover object-center"
                                    loading="lazy"
                                />
                                {hasDiscount && (
                                    <span className="absolute left-4 top-4 rounded-sm bg-[#f53003] px-3 py-1.5 text-sm font-bold text-white">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-rose-500 ring-2 ring-rose-200'
                                                    : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                            aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                                            aria-pressed={selectedImage === index}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - miniatura ${index + 1}`}
                                                className="h-full w-full object-cover object-center"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Title & Price */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                                    {product.name}
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Categoria: {product.category} {product.subcategory && `› ${product.subcategory}`}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-6 dark:from-gray-800 dark:to-gray-700">
                                <div className="flex items-baseline gap-3">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                                                R$ {product.promotionalPrice!.toFixed(2).replace('.', ',')}
                                            </span>
                                            <span className="text-lg text-gray-500 line-through">
                                                R$ {product.price.toFixed(2).replace('.', ',')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                    )}
                                </div>
                                {hasDiscount && (
                                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                        Você economiza R$ {(product.price - product.promotionalPrice!).toFixed(2).replace('.', ',')}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Descrição</h2>
                                <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cor</h2>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`h-12 w-12 rounded-full border-2 transition-all ${
                                                    selectedColor === color
                                                        ? 'border-rose-500 ring-2 ring-rose-200 scale-110'
                                                        : 'border-gray-300 hover:border-rose-300'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Selecionar cor ${color}`}
                                                aria-pressed={selectedColor === color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tamanho</h2>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                                                    selectedSize === size
                                                        ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                                        : 'border-gray-300 text-gray-700 hover:border-rose-300 dark:border-gray-600 dark:text-gray-300'
                                                }`}
                                                aria-label={`Selecionar tamanho ${size}`}
                                                aria-pressed={selectedSize === size}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quantidade</h2>
                                <div className="mt-3 flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold text-gray-700 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        aria-label="Diminuir quantidade"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="h-12 w-20 rounded-lg border-2 border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        min="1"
                                        aria-label="Quantidade"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-xl font-bold text-gray-700 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        aria-label="Aumentar quantidade"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                                >
                                    Adicionar à Sacola
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full rounded-full border-2 border-rose-500 py-4 text-base font-bold text-rose-600 transition-all hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:text-rose-400 dark:hover:bg-rose-900/20"
                                >
                                    Comprar Agora
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="rounded-2xl bg-rose-50 p-4 dark:bg-gray-800">
                                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Frete grátis para compras acima de R$ 299
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Troca grátis em até 30 dias
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Compra 100% segura
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="bg-gradient-to-b from-pink-50 to-white py-12 dark:from-gray-800 dark:to-gray-900">
                        <div className="container mx-auto px-4">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                                Produtos Similares
                            </h2>
                            <p className="mb-8 text-gray-600 dark:text-gray-400">
                                Você também pode gostar
                            </p>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {similarProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

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
