<?php

namespace App\Modules\ProductManagement\Domain\Repositories;

use App\Modules\ProductManagement\Domain\Entities\ProductVariation;

interface ProductVariationRepositoryInterface
{
    public function findById(int $id): ?ProductVariation;

    public function save(ProductVariation $variation): ProductVariation;

    public function update(ProductVariation $variation): ProductVariation;

    /**
     * @return array<ProductVariation>
     */
    public function findByProductId(int $productId, ?bool $active = null): array;

    /**
     * @return array<ProductVariation>
     */
    public function findByProductIdPaginated(int $productId, int $perPage, int $page, ?bool $active = null): array;

    public function countByProductId(int $productId, ?bool $active = null): int;

    public function delete(int $id): void;

    public function deactivate(int $id): void;

    public function activate(int $id): void;

    /**
     * @param  array<int>  $fotoIds
     */
    public function syncFotos(int $variationId, array $fotoIds): void;

    /**
     * @return array<int>
     */
    public function getFotoIds(int $variationId): array;
}
