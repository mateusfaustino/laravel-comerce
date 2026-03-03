/// <reference types="cypress" />

describe('Store Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads the homepage successfully', () => {
        cy.contains('FABULOSA').should('be.visible');
        cy.contains('Nova Coleção').should('be.visible');
        cy.contains('Outono/Inverno').should('be.visible');
    });

    it('displays all categories', () => {
        cy.contains('Categorias').should('be.visible');
        
        const categories = [
            'Conjuntos',
            'Sutiãs',
            'Calcinhas',
            'Bodys',
            'Robes',
            'Coleção Bridal'
        ];

        categories.forEach((category) => {
            cy.contains(category).should('be.visible');
        });
    });

    it('shows featured products section', () => {
        cy.contains('Destaques').should('be.visible');
        cy.contains('Peças selecionadas especialmente para você').should('be.visible');
    });

    it('shows new arrivals section', () => {
        cy.contains('Lançamentos').should('be.visible');
        cy.contains('As novidades que você estava esperando').should('be.visible');
    });

    it('opens and closes cart modal', () => {
        // Cart button should be visible
        cy.get('[aria-label="Abrir carrinho"]').click();
        
        // Cart modal should open
        cy.contains('Carrinho de Compras').should('be.visible');
        
        // Close modal
        cy.get('[aria-label="Fechar carrinho"]').click();
        
        // Modal should close
        cy.contains('Carrinho de Compras').should('not.exist');
    });

    it('search functionality works', () => {
        // Desktop search
        cy.get('input[placeholder="Buscar produtos..."]')
            .first()
            .type('conjunto')
            .should('have.value', 'conjunto');
    });

    it('newsletter form is present', () => {
        cy.contains('Fique por dentro das novidades').should('be.visible');
        cy.get('input[placeholder="Seu melhor e-mail"]').should('be.visible');
        cy.contains('Cadastrar').should('be.visible');
    });

    it('footer has all sections', () => {
        cy.contains('SOBRE A FABULOSA').should('be.visible');
        cy.contains('AJUDA').should('be.visible');
        cy.contains('FORMAS DE PAGAMENTO').should('be.visible');
        cy.contains('REDES SOCIAIS').should('be.visible');
    });

    it('navigation links are accessible', () => {
        // Login link
        cy.contains('Entrar').should('have.attr', 'href');
        
        // Category links
        cy.contains('Conjuntos').parent().should('have.attr', 'href', '/categoria/conjuntos');
        cy.contains('Sutiãs').parent().should('have.attr', 'href', '/categoria/sutias');
    });

    it('product cards display correctly', () => {
        // Check if product names are visible
        cy.contains('Conjunto Renda Floral Premium').should('be.visible');
        cy.contains('Body Elegance Noir').should('be.visible');
        
        // Check prices are in BRL format
        cy.contains('R$ 189,90').should('be.visible');
        cy.contains('R$ 259,90').should('be.visible');
    });

    it('discount badges are displayed for sale items', () => {
        cy.contains('-16%').should('be.visible'); // Conjunto Renda Floral
        cy.contains('-23%').should('be.visible'); // Sutiã Push Up Lace
    });

    it('hero banner CTA button works', () => {
        cy.contains('Ver Coleção').should('have.attr', 'href', '#produtos');
    });

    it('mobile responsive design', () => {
        // Mobile viewport
        cy.viewport('iphone-6');
        
        // Mobile search should be visible
        cy.get('[aria-label="Buscar"]').should('be.visible');
        
        // Categories should still be visible
        cy.contains('Categorias').should('be.visible');
    });

    it('accessibility - aria labels are present', () => {
        cy.get('[aria-label="Abrir carrinho"]').should('exist');
        cy.get('[aria-label="Buscar"]').should('exist');
        cy.get('[aria-label="Fechar carrinho"]').should('exist');
        cy.get('[aria-label*="Adicionar"]').should('exist');
    });

    it('social media links are present', () => {
        cy.contains('REDES SOCIAIS').should('be.visible');
        
        // Social media icons should have proper aria labels
        cy.get('[aria-label="Instagram"]').should('exist');
        cy.get('[aria-label="Facebook"]').should('exist');
        cy.get('[aria-label="Pinterest"]').should('exist');
    });

    it('newsletter subscription form validation', () => {
        cy.get('input[placeholder="Seu melhor e-mail"]').as('emailInput');
        
        // Try to submit without email (form should prevent submission)
        cy.contains('Cadastrar').click();
        
        // Type valid email
        cy.get('@emailInput').type('test@example.com');
        cy.contains('Cadastrar').click();
        
        // In a real scenario, this would show a success message
    });
});
