<?php

namespace App\Modules\ProductManagement\Domain\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Product;

interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;

    public function findBySlug(string $slug): ?Product;

    public function save(Product $product): Product;

    public function update(Product $product): Product;

    /**
     * @return array<Product>
     */
    public function findAll(?bool $active = null): array;

    /**
     * @return array<Product>
     */
    public function findPaginated(int $perPage, int $page, ?bool $active = null): array;

    public function count(?bool $active = null): int;

    public function deactivate(int $id): void;

    public function activate(int $id): void;

    /**
     * @param  array<int>  $categoryIds
     */
    public function syncCategories(int $productId, array $categoryIds): void;

    /**
     * @return array<int>
     */
    public function getCategoryIds(int $productId): array;

    public function updateThumbnail(int $productId, ?int $fotoId): void;

    /**
     * @return array<Product>
     */
    public function findInactive(): array;

    public function permanentlyDelete(int $id): void;

    /**
     * Find active products belonging to a specific category.
     *
     * @return array<Product>
     */
    public function findByCategoryId(int $categoryId, int $limit): array;

    /**
     * Find most recently created active products.
     *
     * @return array<Product>
     */
    public function findRecent(int $limit): array;

    /**
     * Find active products that have a thumbnail foto set.
     *
     * @return array<Product>
     */
    public function findWithThumbnail(int $limit): array;
}
