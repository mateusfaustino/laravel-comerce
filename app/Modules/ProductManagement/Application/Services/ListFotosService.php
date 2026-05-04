<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;

class ListFotosService
{
    public function __construct(
        private FotoRepositoryInterface $fotoRepository,
        private ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * @return array<\App\Modules\ProductManagement\Domain\Entities\Foto>
     */
    public function executeByProduct(int $productId): array
    {
        return $this->fotoRepository->findByProductId($productId);
    }

    /**
     * @return array<\App\Modules\ProductManagement\Domain\Entities\Foto>
     */
    public function executeAll(): array
    {
        return $this->fotoRepository->findByProductId(0);
    }
}
