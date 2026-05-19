import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '@/components/store/product-card';

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

interface Suggestion {
    type: 'product' | 'category' | 'tag';
    label: string;
    href: string;
}

interface SearchBarProps {
    variant?: 'desktop' | 'mobile';
}

const MIN_TERM_LENGTH = 2;
const DEBOUNCE_MS = 250;

const typeLabel: Record<Suggestion['type'], string> = {
    product: 'Produto',
    category: 'Categoria',
    tag: 'Tag',
};

const typeBadgeClass: Record<Suggestion['type'], string> = {
    product: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
    category: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
};

export default function SearchBar({ variant = 'desktop' }: SearchBarProps) {
    const [term, setTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [products, setProducts] = useState<StorefrontProduct[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasQueried, setHasQueried] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Debounced fetch.
    useEffect(() => {
        const trimmed = term.trim();
        if (trimmed.length < MIN_TERM_LENGTH) {
            setSuggestions([]);
            setProducts([]);
            setIsLoading(false);
            setHasQueried(false);
            return;
        }

        setIsLoading(true);
        const handle = window.setTimeout(() => {
            if (abortRef.current) {
                abortRef.current.abort();
            }
            const controller = new AbortController();
            abortRef.current = controller;

            fetch(`/search?q=${encodeURIComponent(trimmed)}&limit=5`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
                signal: controller.signal,
            })
                .then((res) => (res.ok ? res.json() : Promise.reject(res)))
                .then((data: { suggestions: Suggestion[]; products: StorefrontProduct[] }) => {
                    setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
                    setProducts(Array.isArray(data.products) ? data.products : []);
                    setHasQueried(true);
                })
                .catch((err) => {
                    if ((err as DOMException)?.name === 'AbortError') return;
                    setSuggestions([]);
                    setProducts([]);
                    setHasQueried(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, DEBOUNCE_MS);

        return () => {
            window.clearTimeout(handle);
        };
    }, [term]);

    // Click-outside dismiss.
    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    // Escape closes dropdown.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            (event.target as HTMLInputElement).blur();
        }
    };

    const showDropdown =
        isOpen && term.trim().length >= MIN_TERM_LENGTH;

    const containerWidth = variant === 'desktop' ? 'hidden flex-1 max-w-xl md:block' : 'pb-4 md:hidden';

    return (
        <div className={containerWidth}>
            <div ref={containerRef} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => {
                            setTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar produtos..."
                        className="w-full rounded-full border border-rose-200 bg-rose-50 py-2.5 pl-4 pr-12 text-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        aria-label="Buscar produtos"
                        aria-autocomplete="list"
                        aria-expanded={showDropdown}
                        aria-controls="search-dropdown"
                        role="combobox"
                    />
                    <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-full bg-gradient-to-r from-rose-500 to-pink-500 p-2 text-white"
                        aria-hidden="true"
                    >
                        {isLoading ? (
                            <svg
                                className="h-5 w-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
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
                        )}
                    </span>
                </div>

                {showDropdown && (
                    <div
                        id="search-dropdown"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[80vh] overflow-y-auto rounded-2xl border border-rose-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
                    >
                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <ul className="border-b border-rose-100 py-2 dark:border-gray-700" aria-label="Sugestoes">
                                {suggestions.map((s, idx) => (
                                    <li key={`${s.type}-${idx}-${s.label}`} role="option" aria-selected="false">
                                        <Link
                                            href={s.href}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 dark:text-gray-200 dark:hover:bg-gray-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span
                                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeClass[s.type]}`}
                                            >
                                                {typeLabel[s.type]}
                                            </span>
                                            <span className="truncate">{s.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Products */}
                        {products.length > 0 && (
                            <div className="p-3">
                                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Produtos
                                </p>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                    {products.map((product) => (
                                        <div key={product.id} onClick={() => setIsOpen(false)}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {hasQueried && !isLoading && suggestions.length === 0 && products.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
                                Sua busca nao retornou produtos. Simplifique sua pesquisa para ver outros resultados.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
