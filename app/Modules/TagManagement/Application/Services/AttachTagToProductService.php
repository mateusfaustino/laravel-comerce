<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Validation\ValidationException;

class AttachTagToProductService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(int $tagId, int $productId): void
    {
        $tag = $this->tagRepository->findById($tagId);
        if ($tag === null) {
            throw ValidationException::withMessages([
                'tag_id' => ['Tag nao encontrada.'],
            ]);
        }

        $product = $this->productRepository->findById($productId);
        if ($product === null) {
            throw ValidationException::withMessages([
                'product_id' => ['Produto nao encontrado.'],
            ]);
        }

        $this->tagRepository->attachToProduct($tagId, $productId);
    }
}
