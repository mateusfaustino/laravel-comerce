import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/contexts/cart-context';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <>
                <Head title="Carrinho Vazio | Fabulosa Stores" />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    <div className="text-center px-4">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                            Seu carrinho está vazio
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Adicione produtos lindos ao seu carrinho!
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Carrinho de Compras | Fabulosa Stores" />
            <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between md:h-20">
                            <Link
                                href="/"
                                className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text md:text-3xl"
                            >
                                FABULOSA
                            </Link>
                            <Link
                                href="/checkout"
                                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white hover:from-rose-600 hover:to-pink-600"
                            >
                                Finalizar Compra
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                        Carrinho de Compras
                    </h1>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const price = item.promotionalPrice || item.price;
                                const hasDiscount = item.promotionalPrice && item.promotionalPrice < item.price;

                                return (
                                    <div
                                        key={`${item.id}-${item.size || 'no-size'}-${item.color || 'no-color'}`}
                                        className="flex gap-4 rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800"
                                    >
                                        {/* Product Image */}
                                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {item.name}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {item.size && (
                                                        <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                                            Tamanho: {item.size}
                                                        </span>
                                                    )}
                                                    {item.color && (
                                                        <span
                                                            className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700"
                                                        >
                                                            Cor:
                                                            <span
                                                                className="h-3 w-3 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                <div className="flex items-center gap-2">
                                                    {hasDiscount ? (
                                                        <div>
                                                            <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                                                R$ {price.toFixed(2).replace('.', ',')}
                                                            </span>
                                                            <span className="ml-2 text-sm text-gray-500 line-through">
                                                                R$ {item.price.toFixed(2).replace('.', ',')}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                            R$ {price.toFixed(2).replace('.', ',')}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-lg font-bold text-gray-700 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-lg font-bold text-gray-700 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                            aria-label={`Remover ${item.name} do carrinho`}
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                    Resumo do Pedido
                                </h2>

                                <div className="space-y-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Desconto</span>
                                        <span>- R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Frete</span>
                                        <span className="text-sm">Calculado no checkout</span>
                                    </div>
                                </div>

                                <div className="my-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                        R$ {totalPrice.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>

                                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                    ou 12x de R$ {(totalPrice / 12).toFixed(2).replace('.', ',')} sem juros
                                </p>

                                <Link
                                    href="/checkout"
                                    className="mb-3 block w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-4 text-center text-base font-bold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl"
                                >
                                    Finalizar Compra
                                </Link>

                                <Link
                                    href="/"
                                    className="block w-full rounded-full border-2 border-rose-500 py-4 text-center text-base font-bold text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                                >
                                    Continuar Comprando
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 text-rose-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Compra 100% segura
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 text-rose-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        Frete para todo o Brasil
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 text-rose-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Troca grátis em até 30 dias
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

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
