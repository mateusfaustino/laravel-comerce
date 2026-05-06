<?php

namespace App\Modules\Storefront\Application\Services;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDetailDTO;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDTO;
use Illuminate\Support\Facades\Storage;

class GetStorefrontProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    /**
     * @return array<string, mixed>|null
     */
    public function execute(string $slug): ?array
    {
        $product = $this->productRepository->findBySlug($slug);

        if ($product === null || ! $product->isActive()) {
            return null;
        }

        $productId = $product->getId();
        $fotos = $this->fotoRepository->findByProductId($productId);
        $variations = $this->variationRepository->findByProductId($productId, active: true);

        // Build images array
        $images = [];
        $image = null;
        $thumbnailFotoId = $product->getThumbnailFotoId();

        foreach ($fotos as $foto) {
            $url = Storage::disk('public')->url($foto->getPath());
            $images[] = $url;
            if ($thumbnailFotoId !== null && $foto->getId() === $thumbnailFotoId) {
                $image = $url;
            }
        }
        if ($image === null && ! empty($images)) {
            $image = $images[0];
        }

        // Extract price, colors, sizes from variations
        $price = null;
        $promotionalPrice = null;
        $colors = [];
        $sizes = [];
        $variationsArray = [];

        foreach ($variations as $variation) {
            if ($variation->getPrecoVenda() !== null && $price === null) {
                $price = $variation->getPrecoVenda();
            }
            if ($variation->getPrecoPromocional() !== null && $promotionalPrice === null) {
                $promotionalPrice = $variation->getPrecoPromocional();
            }
            $codRgb = $variation->getCorCodRgb();
            if ($codRgb !== null && ! in_array($codRgb, array_column($colors, 'codRgb'))) {
                $colors[] = [
                    'nome' => $variation->getCorNome(),
                    'codRgb' => '#' . $codRgb,
                ];
            }
            $sizeValue = $variation->getTamanhoRoupaAdulto()
                ?? $variation->getTamanhoRoupaCrianca()
                ?? $variation->getTamanhoCalcado();
            if ($sizeValue !== null && ! in_array($sizeValue, $sizes)) {
                $sizes[] = $sizeValue;
            }

            $variationsArray[] = [
                'id' => $variation->getId(),
                'corId' => $variation->getCorId(),
                'corNome' => $variation->getCorNome(),
                'corCodRgb' => $variation->getCorCodRgb(),
                'tamanhoRoupaAdulto' => $variation->getTamanhoRoupaAdulto(),
                'tamanhoRoupaCrianca' => $variation->getTamanhoRoupaCrianca(),
                'tamanhoCalcado' => $variation->getTamanhoCalcado(),
                'active' => $variation->isActive(),
                'quantidadeEstoque' => $variation->getQuantidadeEstoque(),
                'sku' => $variation->getSku(),
                'precoVenda' => $variation->getPrecoVenda(),
                'precoPromocional' => $variation->getPrecoPromocional(),
            ];
        }

        // Get category info
        $categoryName = null;
        $categorySlug = null;
        $categoryNames = $product->getCategoryNames();
        $categoryIds = $product->getCategoryIds();
        if (! empty($categoryNames) && ! empty($categoryIds)) {
            $firstCatId = $categoryIds[0];
            $categoryName = $categoryNames[$firstCatId] ?? array_values($categoryNames)[0];

            $category = $this->categoryRepository->findById($firstCatId);
            if ($category !== null) {
                $categorySlug = $category->getSlug();
            }
        }

        $dto = new StorefrontProductDetailDTO(
            id: $product->getId(),
            nome: $product->getNome(),
            slug: $product->getSlug(),
            price: $price,
            promotionalPrice: $promotionalPrice,
            image: $image,
            categoryName: $categoryName,
            categorySlug: $categorySlug,
            description: $product->getDescricao(),
            images: $images,
            colors: $colors,
            sizes: $sizes,
            variations: $variationsArray,
            isNew: false,
            isFeatured: $thumbnailFotoId !== null,
        );

        // Get similar products
        $similarProducts = $this->getSimilarProducts($product->getId(), $categoryIds);

        return [
            'product' => $dto->toArray(),
            'similarProducts' => array_map(fn (StorefrontProductDTO $dto) => $dto->toArray(), $similarProducts),
        ];
    }

    /**
     * @param  array<int>  $categoryIds
     * @return array<StorefrontProductDTO>
     */
    private function getSimilarProducts(int $productId, array $categoryIds): array
    {
        if (empty($categoryIds)) {
            return [];
        }

        $products = $this->productRepository->findByCategoryId($categoryIds[0], 5);

        $similarProducts = [];
        foreach ($products as $product) {
            if ($product->getId() === $productId) {
                continue;
            }
            $similarProducts[] = $this->mapProductToDTO($product);
            if (count($similarProducts) >= 4) {
                break;
            }
        }

        return $similarProducts;
    }

    private function mapProductToDTO(object $product): StorefrontProductDTO
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
            $codRgb = $variation->getCorCodRgb();
            if ($codRgb !== null && ! in_array($codRgb, array_column($colors, 'codRgb'))) {
                $colors[] = [
                    'nome' => $variation->getCorNome(),
                    'codRgb' => '#' . $codRgb,
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
            isNew: false,
            isFeatured: $thumbnailFotoId !== null,
        );
    }
}
