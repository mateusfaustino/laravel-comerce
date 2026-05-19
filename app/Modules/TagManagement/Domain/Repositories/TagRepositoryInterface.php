<?php

namespace App\Modules\TagManagement\Domain\Repositories;

use App\Modules\TagManagement\Domain\Entities\Tag;

interface TagRepositoryInterface
{
    public function findById(int $id): ?Tag;

    public function findByDescription(string $description): ?Tag;

    public function save(Tag $tag): Tag;

    public function update(Tag $tag): Tag;

    public function delete(int $id): void;

    /**
     * @return array<Tag>
     */
    public function findAll(): array;

    /**
     * @return array{data: array<Tag>, total: int}
     */
    public function findPaginated(int $perPage, int $page, ?string $search = null): array;

    public function count(?string $search = null): int;

    /**
     * @return array<Tag>
     */
    public function searchByDescription(string $term, int $limit = 10): array;

    /**
     * @return array<Tag>
     */
    public function findByProductId(int $productId): array;

    public function attachToProduct(int $tagId, int $productId): void;

    public function detachFromProduct(int $tagId, int $productId): void;

    /**
     * @param  array<int>  $tagIds
     */
    public function syncProductTags(int $productId, array $tagIds): void;

    public function findOrCreateByDescription(string $description): Tag;

    /**
     * @return array<int, array{id: int, nome: string, slug: string, image: ?string}>
     */
    public function getProductsByTagId(int $tagId): array;

    public function countProductsByTagId(int $tagId): int;
}
