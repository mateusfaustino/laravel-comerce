import { Link } from '@inertiajs/react';

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

interface ProductCardProps {
    product: StorefrontProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const numericPrice = product.price ? parseFloat(product.price) : 0;
    const numericPromotionalPrice = product.promotionalPrice ? parseFloat(product.promotionalPrice) : null;

    const hasDiscount = numericPromotionalPrice !== null && numericPromotionalPrice < numericPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((numericPrice - numericPromotionalPrice) / numericPrice) * 100)
        : 0;

    return (
        <Link href={`/produto/${product.slug}`} className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-[#161615]">
            {/* Badge */}
            {product.isNew && (
                <span className="absolute left-3 top-3 z-10 rounded-sm bg-[#f53003] px-2 py-1 text-xs font-semibold text-white">
                    Novo
                </span>
            )}
            {hasDiscount && !product.isNew && (
                <span className="absolute left-3 top-3 z-10 rounded-sm bg-[#f53003] px-2 py-1 text-xs font-semibold text-white">
                    -{discountPercentage}%
                </span>
            )}

            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.nome}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                        <span className="text-4xl font-bold text-rose-300 dark:text-gray-500">
                            {product.nome.charAt(0)}
                        </span>
                    </div>
                )}
                
                {/* Quick Add Button */}
                <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#f53003] py-3 text-center text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
                    aria-label={`Adicionar ${product.nome} ao carrinho`}
                >
                    Adicionar à Sacola
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem]">
                    {product.nome}
                </h3>
                {product.categoryName && (
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {product.categoryName}
                    </p>
                )}

                {/* Colors */}
                {product.colors.length > 0 && (
                    <div className="mb-2 flex gap-1">
                        {product.colors.slice(0, 3).map((color, index) => (
                            <span
                                key={index}
                                className="inline-block h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: color.codRgb }}
                                title={color.nome}
                            />
                        ))}
                        {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{product.colors.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Price */}
                {(numericPrice > 0) && (
                    <div className="mt-2">
                        {hasDiscount ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through">
                                    R$ {numericPrice.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="text-lg font-bold text-[#f53003]">
                                    R$ {numericPromotionalPrice!.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                R$ {numericPrice.toFixed(2).replace('.', ',')}
                            </span>
                        )}
                    </div>
                )}

                {/* Sizes */}
                {product.sizes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size, index) => (
                            <span
                                key={index}
                                className="rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}
