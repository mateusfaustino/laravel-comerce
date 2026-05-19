<?php

namespace App\Modules\Search\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\Search\Application\DTOs\SearchSuggestionDTO;
use App\Modules\Storefront\Application\DTOs\StorefrontProductDTO;
use App\Modules\TagManagement\Domain\Entities\Tag as DomainTag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SearchService
{
    private const PRODUCT_LIMIT = 24;

    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * @return array{suggestions: array<int, array<string, mixed>>, products: array<int, array<string, mixed>>}
     */
    public function execute(string $term, int $limit = 5): array
    {
        $normalized = $this->normalizeTerm($term);

        if ($normalized === '' || mb_strlen($normalized) < 2) {
            return ['suggestions' => [], 'products' => []];
        }

        $like = '%'.$this->escapeLike($normalized).'%';

        // 1. Suggestions: products first, then categories, then tags. Cap at $limit.
        $suggestions = $this->buildSuggestions($like, $normalized, $limit);

        // 2. Product list: products matching name + products attached to matching tags.
        $products = $this->buildProductList($like, $normalized);

        return [
            'suggestions' => array_map(fn (SearchSuggestionDTO $s) => $s->toArray(), $suggestions),
            'products' => array_map(fn (StorefrontProductDTO $p) => $p->toArray(), $products),
        ];
    }

    /**
     * @return array<SearchSuggestionDTO>
     */
    private function buildSuggestions(string $like, string $normalized, int $limit): array
    {
        $suggestions = [];

        // Products by name
        $productRows = DB::table('produtos')
            ->where('active', true)
            ->whereRaw('LOWER(nome) LIKE ?', [$like])
            ->orderByRaw('CASE WHEN LOWER(nome) LIKE ? THEN 0 ELSE 1 END', [$normalized.'%'])
            ->orderBy('nome')
            ->limit($limit)
            ->select('nome', 'slug')
            ->get();

        foreach ($productRows as $row) {
            if (count($suggestions) >= $limit) {
                return $suggestions;
            }
            $suggestions[] = new SearchSuggestionDTO(
                type: 'product',
                label: (string) $row->nome,
                href: '/produto/'.$row->slug,
            );
        }

        // Categories by name
        if (count($suggestions) < $limit) {
            $remaining = $limit - count($suggestions);
            $categoryRows = DB::table('categories')
                ->where('active', true)
                ->whereRaw('LOWER(name) LIKE ?', [$like])
                ->orderBy('name')
                ->limit($remaining)
                ->select('name', 'slug')
                ->get();

            foreach ($categoryRows as $row) {
                if (count($suggestions) >= $limit) {
                    return $suggestions;
                }
                $suggestions[] = new SearchSuggestionDTO(
                    type: 'category',
                    label: (string) $row->name,
                    href: '/categoria/'.$row->slug,
                );
            }
        }

        // Tags by description
        if (count($suggestions) < $limit) {
            $remaining = $limit - count($suggestions);
            $tags = $this->tagRepository->searchByDescription($normalized, $remaining);
            foreach ($tags as $tag) {
                if (count($suggestions) >= $limit) {
                    return $suggestions;
                }
                $description = $tag->getDescription();
                $suggestions[] = new SearchSuggestionDTO(
                    type: 'tag',
                    label: $description,
                    href: '/tag/'.$this->descriptionToSlug($description),
                );
            }
        }

        return $suggestions;
    }

    /**
     * @return array<StorefrontProductDTO>
     */
    private function buildProductList(string $like, string $normalized): array
    {
        // Product ids by name
        $byNameIds = DB::table('produtos')
            ->where('active', true)
            ->whereRaw('LOWER(nome) LIKE ?', [$like])
            ->pluck('id')
            ->all();

        // Product ids attached to matching tags
        $byTagIds = DB::table('tags')
            ->join('produtos_tags', 'tags.id', '=', 'produtos_tags.tag_id')
            ->join('produtos', 'produtos.id', '=', 'produtos_tags.produto_id')
            ->where('produtos.active', true)
            ->whereRaw('LOWER(tags.description) LIKE ?', [$like])
            ->pluck('produtos.id')
            ->all();

        // Merge with name-matches first to keep relevance ordering. Distinct ints.
        $allIds = [];
        foreach ([$byNameIds, $byTagIds] as $bucket) {
            foreach ($bucket as $id) {
                $intId = (int) $id;
                if (! in_array($intId, $allIds, true)) {
                    $allIds[] = $intId;
                }
                if (count($allIds) >= self::PRODUCT_LIMIT) {
                    break 2;
                }
            }
        }

        if (empty($allIds)) {
            return [];
        }

        // Sort: exact-prefix matches on name first within each bucket already preserved.
        // Now push prefix-matches to top inside the merged list for nicer UX.
        usort($allIds, function ($a, $b) use ($normalized) {
            $sa = $this->prefixScore((int) $a, $normalized);
            $sb = $this->prefixScore((int) $b, $normalized);

            return $sa <=> $sb;
        });

        $dtos = [];
        foreach ($allIds as $productId) {
            $product = $this->productRepository->findById($productId);
            if ($product === null) {
                continue;
            }
            $dtos[] = $this->mapProductToDTO($product);
        }

        return $dtos;
    }

    /**
     * Lower score wins. 0 = name starts with term; 1 = otherwise.
     */
    private function prefixScore(int $productId, string $normalized): int
    {
        $row = DB::table('produtos')->where('id', $productId)->select('nome')->first();
        if ($row === null) {
            return 2;
        }
        $name = mb_strtolower((string) $row->nome);

        return str_starts_with($name, $normalized) ? 0 : 1;
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

    private function normalizeTerm(string $term): string
    {
        // Lowercase, trim, collapse whitespace. Mirrors Tag::normalize semantics.
        $term = mb_strtolower(trim($term));
        $term = (string) preg_replace('/\s+/u', ' ', $term);

        return $term;
    }

    private function escapeLike(string $term): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $term);
    }

    public function descriptionToSlug(string $description): string
    {
        $normalized = DomainTag::normalize($description);

        return str_replace(' ', '-', $normalized);
    }
}
