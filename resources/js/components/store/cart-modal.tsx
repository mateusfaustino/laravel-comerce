import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useCart, CartItem } from '@/contexts/cart-context';

export default function CartModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

    return (
        <>
            {/* Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Abrir carrinho"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f53003] text-xs font-bold text-white">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Cart Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                    
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-[#161615]">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-6 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Carrinho de Compras
                                    </h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        aria-label="Fechar carrinho"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Cart Items */}
                                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <svg
                                                className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
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
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Seu carrinho está vazio
                                            </p>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4"
                                            >
                                                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            Tamanho: {item.size} | Cor: {item.color}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex flex-1 items-end justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                                aria-label="Diminuir quantidade"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-sm text-gray-900 dark:text-white">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                                aria-label="Aumentar quantidade"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-sm font-medium text-[#f53003] hover:text-[#d42a02]"
                                                            aria-label={`Remover ${item.name} do carrinho`}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                {items.length > 0 && (
                                    <div className="border-t border-gray-200 px-4 py-6 dark:border-gray-700">
                                        <div className="mb-4 flex justify-between text-base font-medium">
                                            <p className="text-gray-900 dark:text-white">Subtotal</p>
                                            <p className="text-gray-900 dark:text-white">
                                                R$ {totalPrice.toFixed(2).replace('.', ',')}
                                            </p>
                                        </div>
                                        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                            Frete calculado no checkout
                                        </p>
                                        <Link
                                            href="/checkout"
                                            className="flex w-full items-center justify-center rounded-md bg-[#f53003] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#d42a02] focus:outline-none focus:ring-2 focus:ring-[#f53003] focus:ring-offset-2"
                                        >
                                            Finalizar Compra
                                        </Link>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="mt-2 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Continuar Comprando
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
