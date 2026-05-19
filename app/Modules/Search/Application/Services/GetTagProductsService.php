<?php

namespace App\Modules\Search\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDTO;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Support\Facades\Storage;

class GetTagProductsService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private ProductRepositoryInterface $productRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    /**
     * @return array{tag: array<string, mixed>, products: array<int, array<string, mixed>>}|null
     */
    public function execute(string $slug): ?array
    {
        $description = $this->slugToDescription($slug);
        $tag = $this->tagRepository->findByDescription($description);

        if ($tag === null) {
            return null;
        }

        $tagId = $tag->getId();
        if ($tagId === null) {
            return null;
        }

        // getProductsByTagId returns array of ['id', 'nome', 'slug', 'image' => url]
        // but we want full StorefrontProductDTOs (with price, colors, sizes, discount).
        $rows = $this->tagRepository->getProductsByTagId($tagId);

        $dtos = [];
        foreach ($rows as $row) {
            $productId = (int) ($row['id'] ?? 0);
            if ($productId === 0) {
                continue;
            }
            $product = $this->productRepository->findById($productId);
            if ($product === null) {
                continue;
            }
            $dtos[] = $this->mapProductToDTO($product);
        }

        return [
            'tag' => [
                'id' => $tagId,
                'description' => $tag->getDescription(),
            ],
            'products' => array_map(fn (StorefrontProductDTO $p) => $p->toArray(), $dtos),
        ];
    }

    private function slugToDescription(string $slug): string
    {
        return mb_strtolower(trim(str_replace('-', ' ', $slug)));
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
                    'codRgb' => '#'.$codRgb,
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
