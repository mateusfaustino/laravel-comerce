<?php

namespace App\Modules\Storefront\Application\Services;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\Storefront\Application\DTOs\StorefrontCategoryDTO;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDTO;
use Illuminate\Support\Facades\Storage;

class ListStorefrontHomeService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private ProductRepositoryInterface $productRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        $rootCategories = $this->categoryRepository->findRootCategories(active: true);

        $categories = [];
        foreach ($rootCategories as $category) {
            $productCount = count($this->productRepository->findByCategoryId($category->getId(), 1000));

            // Skip categories with no products
            if ($productCount === 0) {
                continue;
            }

            $children = $this->categoryRepository->findChildren($category->getId());
            $subcategories = [];
            foreach ($children as $child) {
                if ($child->isActive()) {
                    $childProductCount = count($this->productRepository->findByCategoryId($child->getId(), 1000));
                    if ($childProductCount > 0) {
                        $subcategories[] = [
                            'name' => $child->getName(),
                            'slug' => $child->getSlug(),
                        ];
                    }
                }
            }

            $categories[] = new StorefrontCategoryDTO(
                id: $category->getId(),
                name: $category->getName(),
                slug: $category->getSlug(),
                image: $this->getCategoryImage($category->getId()),
                description: null,
                subcategories: $subcategories,
                productCount: $productCount,
            );
        }

        $featuredProducts = $this->mapProductsToDTOs(
            $this->productRepository->findWithThumbnail(8)
        );

        $newProducts = $this->mapProductsToDTOs(
            $this->productRepository->findRecent(8),
            isNew: true
        );

        $categoryProducts = [];
        foreach ($rootCategories as $category) {
            $products = $this->productRepository->findByCategoryId($category->getId(), 4);
            if (count($products) > 0) {
                $categoryProducts[$category->getName()] = $this->mapProductsToDTOs($products);
            }
        }

        return [
            'categories' => array_map(fn (StorefrontCategoryDTO $dto) => $dto->toArray(), $categories),
            'featuredProducts' => array_map(fn (StorefrontProductDTO $dto) => $dto->toArray(), $featuredProducts),
            'newProducts' => array_map(fn (StorefrontProductDTO $dto) => $dto->toArray(), $newProducts),
            'categoryProducts' => array_map(
                fn (array $products) => array_map(fn (StorefrontProductDTO $dto) => $dto->toArray(), $products),
                $categoryProducts
            ),
        ];
    }

    /**
     * Get a representative image URL for a category (from its first product's thumbnail).
     */
    private function getCategoryImage(int $categoryId): ?string
    {
        $products = $this->productRepository->findByCategoryId($categoryId, 1);

        if (empty($products)) {
            return null;
        }

        $product = $products[0];
        $fotos = $this->fotoRepository->findByProductId($product->getId());

        if (empty($fotos)) {
            return null;
        }

        return Storage::disk('public')->url($fotos[0]->getPath());
    }

    /**
     * @param  array<object>  $products
     * @return array<StorefrontProductDTO>
     */
    private function mapProductsToDTOs(array $products, bool $isNew = false): array
    {
        $dtos = [];
        foreach ($products as $product) {
            $dtos[] = $this->mapProductToDTO($product, $isNew);
        }

        return $dtos;
    }

    private function mapProductToDTO(object $product, bool $isNew = false): StorefrontProductDTO
    {
        $fotos = $this->fotoRepository->findByProductId($product->getId());
        $variations = $this->variationRepository->findByProductId($product->getId(), active: true);

        $image = null;
        $thumbnailFotoId = $product->getThumbnailFotoId();
        if ($thumbnailFotoId !== null) {
            foreach ($fotos as $foto) {
                if ($foto->getId() === $thumbnailFotoId) {
                    $image = Storage::disk('public')->url($foto->getPath());
                    break;
                }
            }
        }
        if ($image === null && ! empty($fotos)) {
            $image = Storage::disk('public')->url($fotos[0]->getPath());
        }

        $price = null;
        $promotionalPrice = null;
        $colors = [];
        $sizes = [];

        foreach ($variations as $variation) {
            if ($variation->getPrecoVenda() !== null && $price === null) {
                $price = $variation->getPrecoVenda();
            }
            if ($variation->getPrecoPromocional() !== null && $promotionalPrice === null) {
                $promotionalPrice = $variation->getPrecoPromocional();
            }
            if ($variation->getCorCodRgb() !== null && ! in_array($variation->getCorCodRgb(), array_column($colors, 'codRgb'))) {
                $colors[] = [
                    'nome' => $variation->getCorNome(),
                    'codRgb' => $variation->getCorCodRgb(),
                ];
            }
            $sizeValue = $variation->getTamanhoRoupaAdulto()
                ?? $variation->getTamanhoRoupaCrianca()
                ?? $variation->getTamanhoCalcado();
            if ($sizeValue !== null && ! in_array($sizeValue, $sizes)) {
                $sizes[] = $sizeValue;
            }
        }

        $categoryName = null;
        $categoryNames = $product->getCategoryNames();
        if (! empty($categoryNames)) {
            $categoryName = array_values($categoryNames)[0];
        }

        return new StorefrontProductDTO(
            id: $product->getId(),
            nome: $product->getNome(),
            slug: $product->getSlug(),
            price: $price,
            promotionalPrice: $promotionalPrice,
            image: $image,
            categoryName: $categoryName,
            colors: $colors,
            sizes: $sizes,
            isNew: $isNew,
            isFeatured: $thumbnailFotoId !== null,
        );
    }
}
