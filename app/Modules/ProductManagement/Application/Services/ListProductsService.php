<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;

class ListProductsService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(int $perPage, int $page, ?bool $active = null): array
    {
        $products = $this->productRepository->findPaginated($perPage, $page, $active);
        $total = $this->productRepository->count($active);

        return [
            'products' => $products,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }
}
