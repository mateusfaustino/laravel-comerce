<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;

class ListProductVariationsService
{
    public function __construct(
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(int $productId, int $perPage, int $page, ?bool $active = null): array
    {
        $variations = $this->variationRepository->findByProductIdPaginated($productId, $perPage, $page, $active);
        $total = $this->variationRepository->countByProductId($productId, $active);

        return [
            'variations' => $variations,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }
}
