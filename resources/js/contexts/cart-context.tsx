import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    promotionalPrice?: number;
    image: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'fabulosa_cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setItems(parsed);
            } catch (e) {
                console.error('Failed to parse cart from localStorage:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (item: CartItem) => {
        setItems(currentItems => {
            const existingItemIndex = currentItems.findIndex(
                i => i.id === item.id && i.size === item.size && i.color === item.color
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            }

            // Add new item
            return [...currentItems, item];
        });
    };

    const removeFromCart = (itemId: number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce((sum, item) => {
        const price = item.promotionalPrice || item.price;
        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
