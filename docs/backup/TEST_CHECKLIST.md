# Test Checklist - Store Homepage

## Manual Testing Checklist

### 1. Page Load ✅
- [ ] Homepage loads without errors
- [ ] All images load correctly
- [ ] No console errors in browser DevTools
- [ ] Vite dev server is running (port 5174)

### 2. Header Section ✅
- [ ] Logo "FABULOSA" is visible
- [ ] Search bar appears on desktop
- [ ] Mobile search appears on small screens
- [ ] Login button is clickable
- [ ] Cart icon shows item count (2 items in mock)

### 3. Hero Banner ✅
- [ ] Background image displays correctly
- [ ] "Nova Coleção Outono/Inverno" text is visible
- [ ] Description text is readable
- [ ] "Ver Coleção" button scrolls to products section

### 4. Categories Section ✅
- [ ] Section title "Categorias" is visible
- [ ] All 6 categories display:
  - [ ] Conjuntos (45 produtos)
  - [ ] Sutiãs (32 produtos)
  - [ ] Calcinhas (58 produtos)
  - [ ] Bodys (18 produtos)
  - [ ] Robes (12 produtos)
  - [ ] Coleção Bridal (8 produtos)
- [ ] Category cards have hover effect
- [ ] Clicking category navigates to category page

### 5. Featured Products Section ✅
- [ ] Section title "Destaques" is visible
- [ ] Subtitle "Peças selecionadas especialmente para você"
- [ ] 4 featured products display:
  - [ ] Conjunto Renda Floral Premium
  - [ ] Body Elegance Noir
  - [ ] Robe de Seda Luxe
  - [ ] (Check if more exist)
- [ ] Product cards show:
  - [ ] Product image
  - [ ] Name
  - [ ] Category
  - [ ] Color swatches
  - [ ] Size tags
  - [ ] Price in BRL format
- [ ] Discount badges appear for sale items
- [ ] "Ver todos" link appears (desktop only)
- [ ] Hover effect shows "Adicionar à Sacola" button

### 6. New Arrivals Section ✅
- [ ] Section title "Lançamentos" is visible
- [ ] Subtitle "As novidades que você estava esperando"
- [ ] New products display with "Novo" badge
- [ ] Products include:
  - [ ] Conjunto Renda Floral Premium
  - [ ] Sutiã Push Up Lace
  - [ ] Conjunto Bridal Collection

### 7. Newsletter Section ✅
- [ ] Red background section is visible
- [ ] Title "Fique por dentro das novidades"
- [ ] Email input field appears
- [ ] "Cadastrar" button is clickable
- [ ] Terms text displays at bottom

### 8. Footer Section ✅
- [ ] 4 columns display:
  - [ ] SOBRE A FABULOSA (Nossa História, Carreiras, Sustentabilidade)
  - [ ] AJUDA (FAQ, Trocas e Devoluções, Prazos de Entrega, Fale Conosco)
  - [ ] FORMAS DE PAGAMENTO (placeholder icons)
  - [ ] REDES SOCIAIS (Instagram, Facebook, Pinterest icons)
- [ ] Copyright text at bottom

### 9. Shopping Cart Modal ✅
- [ ] Click cart icon opens modal
- [ ] Modal shows "Carrinho de Compras" header
- [ ] 2 mock items display:
  - [ ] Conjunto Renda Floral (R$ 189,90)
  - [ ] Body Elegance (R$ 259,90)
- [ ] Each item shows:
  - [ ] Product image
  - [ ] Name
  - [ ] Size and color
  - [ ] Quantity controls (+/-)
  - [ ] Remove button
- [ ] Subtotal calculates correctly
- [ ] Shipping info text displays
- [ ] "Finalizar Compra" button is visible
- [ ] "Continuar Comprando" closes modal
- [ ] Close button (X) works

### 10. Responsiveness ✅
Test at different breakpoints:
- [ ] Mobile (< 640px)
  - [ ] Mobile search bar appears
  - [ ] Categories grid: 2 columns
  - [ ] Products grid: 1 column
  - [ ] Hamburger menu (if implemented)
- [ ] Tablet (640px - 1024px)
  - [ ] Search bar appears
  - [ ] Categories grid: 3 columns
  - [ ] Products grid: 2 columns
- [ ] Desktop (> 1024px)
  - [ ] Full navigation
  - [ ] Categories grid: 6 columns
  - [ ] Products grid: 4 columns

### 11. Accessibility ✅
- [ ] Tab through all interactive elements
- [ ] All buttons have aria-labels
- [ ] Images have alt text
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Screen reader can read content

### 12. Performance ✅
- [ ] Images use lazy loading
- [ ] Page loads quickly
- [ ] Smooth animations (no jank)
- [ ] No memory leaks

### 13. Dark Mode ✅
- [ ] Toggle system dark mode
- [ ] Page switches to dark theme
- [ ] Text remains readable
- [ ] Images still display correctly
- [ ] Contrast ratios maintained

## Automated Tests

### Unit Tests (Vitest)
Run command: `npm run test`

Expected results:
- [ ] 15+ tests pass
- [ ] 0 tests fail
- [ ] No warnings

Test coverage:
- [ ] Component renders correctly
- [ ] Categories display
- [ ] Featured products display
- [ ] New arrivals display
- [ ] Cart modal opens/closes
- [ ] Search functionality works
- [ ] Newsletter form present
- [ ] Navigation links work
- [ ] Prices display in BRL
- [ ] Discount badges show
- [ ] Footer sections present
- [ ] Responsive design works

### E2E Tests (Cypress)
Run command: `npx cypress open`

Expected results:
- [ ] 18+ tests pass
- [ ] 0 tests fail
- [ ] Screenshots captured for failures
- [ ] Videos recorded for test runs

Test coverage:
- [ ] Page loads successfully
- [ ] All sections visible
- [ ] Cart interactions work
- [ ] Search works
- [ ] Navigation works
- [ ] Responsive design verified
- [ ] Accessibility features present

## Browser Compatibility

Test in each browser:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile (iOS/Android)
- [ ] Safari Mobile (iOS)

## Known Issues

List any issues found during testing:
1. 
2. 
3. 

## Performance Metrics

Use Lighthouse to measure:
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+
- [ ] PWA: N/A (not a PWA yet)

## Sign-off

Tester: _______________
Date: _______________
Status: [ ] Pass [ ] Fail

Notes:
_______________________________________
_______________________________________
_______________________________________
