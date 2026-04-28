# Getting Started - Fabulosa Stores E-commerce

## Quick Start Guide

### Prerequisites
- Node.js 20.19+ or 22.12+ (recommended to upgrade from 22.11.0)
- Docker & Docker Compose
- PHP 8.3+
- Composer

### Installation Steps

#### 1. Start Docker Containers
```bash
docker-compose -f docker-compose.local.yml up -d
```

This will start:
- Laravel application (port 8000)
- MySQL database (port 3300)
- Redis (internal)

#### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

#### 3. Run Database Migrations
```bash
# Inside Docker container
docker-compose -f docker-compose.local.yml exec app php artisan migrate
```

#### 4. Start Development Servers

**Option A: Vite Dev Server (Recommended for development)**
```bash
# Terminal 1: Keep this running for frontend development
npm run dev

# Access application at http://localhost:8000
```

**Option B: Build for Production**
```bash
npm run build
```

### Accessing the Application

- **Storefront**: http://localhost:8000
- **Vite Dev Server**: http://localhost:5174 (automatically used by Laravel)

## Project Structure

```
resources/js/
├── components/
│   ├── store/           # Store-specific components
│   │   ├── product-card.tsx
│   │   ├── category-card.tsx
│   │   └── cart-modal.tsx
│   └── ui/              # Reusable UI components
├── data/
│   └── mock-store.ts    # Mock product and category data
├── pages/
│   └── store-homepage.tsx  # Main homepage
└── ...
```

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

Test files location: `tests/Js/pages/`

### E2E Tests (Cypress)
```bash
npx cypress open
```

Test files location: `tests/Browser/pages/`

## Features Implemented

### Homepage Sections
1. **Header**
   - Logo/Branding
   - Search bar (desktop + mobile)
   - Login link
   - Shopping cart with item counter

2. **Hero Banner**
   - Seasonal promotion
   - Call-to-action button

3. **Categories**
   - 6 category cards
   - Visual navigation
   - Product count display

4. **Featured Products**
   - Curated product selection
   - Discount badges
   - Quick add to cart

5. **New Arrivals**
   - Latest products
   - "New" badges

6. **Newsletter**
   - Email subscription form
   - Terms acceptance

7. **Footer**
   - About links
   - Help/Support
   - Payment methods
   - Social media links

### Accessibility
- ✅ WCAG 2.1 Level AA compliant
- ✅ Semantic HTML throughout
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### Performance
- ✅ Lazy loading images
- ✅ Optimized bundle size
- ✅ Hot Module Replacement (HMR)
- ✅ Code splitting ready

## Development Guidelines

### Component Architecture
```tsx
import { Link } from '@inertiajs/react';

interface Props {
    // Define props here
}

export default function ComponentName({ }: Props) {
    return (
        // Component JSX
    );
}
```

### Styling Conventions
- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Dark mode support with `dark:` variants
- Consistent spacing scale

### State Management
- Use React hooks (useState, useEffect)
- Local state for component-specific data
- Inertia for global state and routing

## Common Tasks

### Adding a New Product
Edit `resources/js/data/mock-store.ts`:
```typescript
{
    id: 9,
    name: 'Product Name',
    description: 'Description',
    price: 99.90,
    promotionalPrice: 79.90, // Optional
    image: 'https://...',
    category: 'Category',
    colors: ['#000000'],
    sizes: ['P', 'M', 'G'],
    isNew: true, // Optional
    isFeatured: false, // Optional
}
```

### Adding a New Category
Edit `resources/js/data/mock-store.ts`:
```typescript
{
    id: 7,
    name: 'Category Name',
    slug: 'category-slug',
    image: 'https://...',
    productCount: 24,
}
```

### Creating a New Component
```bash
# Create file in resources/js/components/store/
touch resources/js/components/store/my-component.tsx
```

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically use 5174, 5175, etc.

### Database Connection Issues
```bash
# Check if MySQL container is running
docker-compose -f docker-compose.local.yml ps

# Restart containers
docker-compose -f docker-compose.local.yml restart
```

### Node.js Version Warning
The current version (22.11.0) works but shows warnings. Upgrade to 22.12+ recommended:
```bash
nvm install 22.12.0
nvm use 22.12.0
```

### Clear Cache
```bash
# Laravel cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Node modules (if needed)
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

### Phase 1 (Current)
- ✅ Homepage with mock data
- ✅ Product catalog
- ✅ Shopping cart UI
- ✅ Responsive design
- ✅ Accessibility compliance

### Phase 2 (Upcoming)
- [ ] Product detail pages
- [ ] Category listing pages
- [ ] Backend integration
- [ ] User authentication
- [ ] Cart persistence
- [ ] Checkout flow
- [ ] WhatsApp integration

### Phase 3 (Future)
- [ ] Admin dashboard
- [ ] Product management
- [ ] Order management
- [ ] Payment gateway
- [ ] Shipping calculation
- [ ] Analytics

## Support

For questions or issues:
- Check documentation in `/documentation` folder
- Review requirements in `requirements.md`
- Contact development team

---

**Last Updated:** March 2, 2026
**Version:** 1.0
