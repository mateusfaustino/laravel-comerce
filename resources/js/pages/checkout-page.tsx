import { Head, Link, router } from '@inertiajs/react';
import { useCart } from '@/contexts/cart-context';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'pix',
    });

    if (items.length === 0) {
        return (
            <>
                <Head title="Checkout | Fabulosa Stores" />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    <div className="text-center px-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Carrinho vazio
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Adicione produtos antes de finalizar sua compra
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Here you would send the order to your backend
        console.log('Order submitted:', {
            customer: formData,
            items,
            total: totalPrice,
        });

        // Clear cart and redirect to success page
        clearCart();
        alert('Pedido realizado com sucesso! Em breve você receberá mais informações.');
        router.visit('/');
    };

    const shippingCost = 0; // Free shipping for demo
    const finalTotal = totalPrice + shippingCost;

    return (
        <>
            <Head title="Finalizar Compra | Fabulosa Stores" />
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
                                href="/cart"
                                className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
                            >
                                ← Voltar ao carrinho
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                        Finalizar Compra
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Customer & Shipping Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Customer Information */}
                                <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        Informações Pessoais
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Nome Completo *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                E-mail *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Telefone/WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Shipping Address */}
                                <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        Endereço de Entrega
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                CEP *
                                            </label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                required
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="00000-000"
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Logradouro *
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Número *
                                            </label>
                                            <input
                                                type="text"
                                                id="number"
                                                name="number"
                                                required
                                                value={formData.number}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Complemento
                                            </label>
                                            <input
                                                type="text"
                                                id="complement"
                                                name="complement"
                                                value={formData.complement}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bairro *
                                            </label>
                                            <input
                                                type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                required
                                                value={formData.neighborhood}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Cidade *
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Estado *
                                            </label>
                                            <select
                                                id="state"
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="SP">São Paulo</option>
                                                <option value="RJ">Rio de Janeiro</option>
                                                <option value="MG">Minas Gerais</option>
                                                <option value="RS">Rio Grande do Sul</option>
                                                {/* Add more states as needed */}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Method */}
                                <section className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        Forma de Pagamento
                                    </h2>
                                    <div className="space-y-3">
                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-rose-300 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 dark:border-gray-700 dark:hover:border-rose-700 dark:has-[:checked]:bg-rose-900/20">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="pix"
                                                checked={formData.paymentMethod === 'pix'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-rose-600"
                                            />
                                            <div>
                                                <span className="font-semibold text-gray-900 dark:text-white">PIX</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Aprovação imediata • 5% de desconto
                                                </p>
                                            </div>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-rose-300 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 dark:border-gray-700 dark:hover:border-rose-700 dark:has-[:checked]:bg-rose-900/20">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="credit_card"
                                                checked={formData.paymentMethod === 'credit_card'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-rose-600"
                                            />
                                            <div>
                                                <span className="font-semibold text-gray-900 dark:text-white">Cartão de Crédito</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Parcelamento em até 12x
                                                </p>
                                            </div>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-colors hover:border-rose-300 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 dark:border-gray-700 dark:hover:border-rose-700 dark:has-[:checked]:bg-rose-900/20">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="boleto"
                                                checked={formData.paymentMethod === 'boleto'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-rose-600"
                                            />
                                            <div>
                                                <span className="font-semibold text-gray-900 dark:text-white">Boleto Bancário</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Vencimento em 1 dia útil
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </section>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        Resumo do Pedido
                                    </h2>

                                    {/* Products */}
                                    <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
                                        {items.map((item) => {
                                            const price = item.promotionalPrice || item.price;
                                            return (
                                                <div key={`${item.id}-${item.size || 'no-size'}`} className="flex gap-3">
                                                    <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            Qtd: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                                                            R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>Subtotal ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'})</span>
                                            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                            <span>Frete</span>
                                            <span>Grátis</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900 dark:text-white dark:border-gray-700">
                                            <span>Total</span>
                                            <span className="text-rose-600 dark:text-rose-400">
                                                R$ {finalTotal.toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="mt-6 w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl"
                                    >
                                        Confirmar Pedido
                                    </button>

                                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        Ao confirmar, você concorda com nossos Termos e Política de Privacidade
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
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
