<?php

namespace App\Modules\CategoryManagement\Domain\Repositories;

use App\Modules\CategoryManagement\Domain\Entities\Category;

interface CategoryRepositoryInterface
{
    public function findById(int $id): ?Category;

    public function findBySlug(string $slug): ?Category;

    public function save(Category $category): Category;

    public function update(Category $category): Category;

    /**
     * @return array<Category>
     */
    public function findAll(?bool $active = null): array;

    /**
     * @return array<Category>
     */
    public function findPaginated(int $perPage, int $page, ?bool $active = null): array;

    public function count(?bool $active = null): int;

    public function deactivate(int $id): void;

    /**
     * @return array<Category>
     */
    public function findHierarchy(): array;
}
