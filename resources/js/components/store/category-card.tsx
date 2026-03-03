import { Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    productCount?: number;
}

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/categoria/${category.slug}`}
            className="group relative block overflow-hidden rounded-lg"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold tracking-wide">
                        {category.name}
                    </h3>
                    {category.productCount !== undefined && (
                        <p className="mt-1 text-sm text-gray-200">
                            {category.productCount} produtos
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
