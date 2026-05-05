import { Link } from '@inertiajs/react';

interface StorefrontCategory {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    subcategories: { name: string; slug: string }[];
    productCount: number;
}

interface CategoryCardProps {
    category: StorefrontCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/categoria/${category.slug}`}
            className="group relative block overflow-hidden rounded-lg"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                        <span className="text-5xl font-bold text-rose-300 dark:text-gray-500">
                            {category.name.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold tracking-wide">
                        {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-200">
                        {category.productCount} produto{category.productCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </Link>
    );
}
