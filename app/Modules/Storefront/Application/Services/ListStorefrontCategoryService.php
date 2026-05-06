<?php

namespace App\Modules\Storefront\Application\Services;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDTO;
use Illuminate\Support\Facades\Storage;

class ListStorefrontCategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private ProductRepositoryInterface $productRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    /**
     * @return array<string, mixed>|null
     */
    public function execute(string $slug): ?array
    {
        $category = $this->categoryRepository->findBySlug($slug);

        if ($category === null || ! $category->isActive()) {
            return null;
        }

        $categoryId = $category->getId();

        // Get subcategories
        $children = $this->categoryRepository->findChildren($categoryId);
        $subcategories = [];
        foreach ($children as $child) {
            if ($child->isActive()) {
                $subcategories[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'slug' => $child->getSlug(),
                    'productCount' => count($this->productRepository->findByCategoryId($child->getId(), 1000)),
                ];
            }
        }

        // Get category image
        $image = $this->getCategoryImage($categoryId);

        // Get products in this category (including products in subcategories)
        $products = $this->productRepository->findByCategoryId($categoryId, 24);

        // Also get products from subcategories
        foreach ($children as $child) {
            if ($child->isActive()) {
                $childProducts = $this->productRepository->findByCategoryId($child->getId(), 24);
                $products = array_merge($products, $childProducts);
            }
        }

        $productDTOs = $this->mapProductsToDTOs($products);

        // Build breadcrumb: check if this category has a parent
        $breadcrumb = [];
        if ($category->getParentId() !== null) {
            $parent = $this->categoryRepository->findById($category->getParentId());
            if ($parent !== null) {
                $breadcrumb[] = [
                    'name' => $parent->getName(),
                    'slug' => $parent->getSlug(),
                ];
            }
        }

        return [
            'category' => [
                'id' => $categoryId,
                'name' => $category->getName(),
                'slug' => $category->getSlug(),
                'image' => $image,
                'description' => null,
                'subcategories' => $subcategories,
                'productCount' => count($products),
                'breadcrumb' => $breadcrumb,
            ],
            'products' => array_map(fn (StorefrontProductDTO $dto) => $dto->toArray(), $productDTOs),
        ];
    }

    private function getCategoryImage(int $categoryId): ?string
    {
        $products = $this->productRepository->findByCategoryId($categoryId, 1);

        if (empty($products)) {
            return null;
        }

        $fotos = $this->fotoRepository->findByProductId($products[0]->getId());

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
        // Deduplicate by product ID (products may appear in parent + child categories)
        $seen = [];
        $unique = [];
        foreach ($products as $product) {
            if (! in_array($product->getId(), $seen)) {
                $seen[] = $product->getId();
                $unique[] = $product;
            }
        }

        $dtos = [];
        foreach ($unique as $product) {
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
            if ($variation->getCorCodRgb() !== null && ! in_array($variation->getCorCodRgb(), $colors)) {
                $colors[] = $variation->getCorCodRgb();
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
