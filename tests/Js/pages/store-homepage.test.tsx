import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createInertiaApp } from '@inertiajs/react';
import StoreHomepage from '@/pages/store-homepage';
import { products, categories } from '@/data/mock-store';

// Mock Inertia hook
const mockUsePage = () => ({
    props: {},
    url: '/',
    component: 'store-homepage',
});

describe('StoreHomepage', () => {
    const defaultProps = {};

    it('renders the homepage correctly', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        // Check if logo is present
        expect(screen.getByText('FABULOSA')).toBeInTheDocument();
        
        // Check if hero section is present
        expect(screen.getByText(/Nova Coleção/i)).toBeInTheDocument();
        expect(screen.getByText(/Outono\/Inverno/i)).toBeInTheDocument();
    });

    it('displays all categories', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        expect(screen.getByText('Categorias')).toBeInTheDocument();
        
        categories.forEach((category) => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
        });
    });

    it('displays featured products section', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        expect(screen.getByText('Destaques')).toBeInTheDocument();
        
        products.filter(p => p.isFeatured).forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    it('displays new arrivals section', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        expect(screen.getByText('Lançamentos')).toBeInTheDocument();
        
        products.filter(p => p.isNew).forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    it('opens cart modal when cart button is clicked', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        const cartButton = screen.getByLabelText('Abrir carrinho');
        fireEvent.click(cartButton);
        
        expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument();
    });

    it('has search functionality', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        const searchInputs = screen.getAllByPlaceholderText('Buscar produtos...');
        expect(searchInputs.length).toBeGreaterThan(0);
        
        const searchInput = searchInputs[0];
        fireEvent.change(searchInput, { target: { value: 'conjunto' } });
        expect(searchInput).toHaveValue('conjunto');
    });

    it('displays newsletter section', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        expect(screen.getByText(/Fique por dentro das novidades/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Seu melhor e-mail')).toBeInTheDocument();
    });

    it('has accessible navigation links', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        // Check login link
        expect(screen.getByText('Entrar')).toBeInTheDocument();
        
        // Check category links
        categories.forEach((category) => {
            const categoryLink = screen.getByRole('link', { name: category.name });
            expect(categoryLink).toHaveAttribute('href', `/categoria/${category.slug}`);
        });
    });

    it('displays product prices in BRL format', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        products.forEach((product) => {
            const priceText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
            expect(screen.getByText(priceText)).toBeInTheDocument();
        });
    });

    it('shows discount badges for products with promotional price', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        products.forEach((product) => {
            if (product.promotionalPrice && product.promotionalPrice < product.price) {
                const discountPercentage = Math.round(
                    ((product.price - product.promotionalPrice) / product.price) * 100
                );
                expect(screen.getByText(`-${discountPercentage}%`)).toBeInTheDocument();
            }
        });
    });

    it('has footer with proper sections', () => {
        render(<StoreHomepage {...defaultProps} />);
        
        expect(screen.getByText('SOBRE A FABULOSA')).toBeInTheDocument();
        expect(screen.getByText('AJUDA')).toBeInTheDocument();
        expect(screen.getByText('FORMAS DE PAGAMENTO')).toBeInTheDocument();
        expect(screen.getByText('REDES SOCIAIS')).toBeInTheDocument();
    });

    it('is responsive and shows mobile search on small screens', () => {
        const { container } = render(<StoreHomepage {...defaultProps} />);
        
        // Mobile search should be present
        const mobileSearchButtons = container.querySelectorAll('[aria-label="Buscar"]');
        expect(mobileSearchButtons.length).toBeGreaterThan(0);
    });
});
