<?php

namespace App\Modules\CategoryManagement\Application\Services;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;

class ListCategoriesService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
    ) {}

    /**
     * @return array{categories: array, total: int, perPage: int, currentPage: int}
     */
    public function execute(int $perPage = 15, int $page = 1, ?bool $active = null): array
    {
        $categories = $this->categoryRepository->findPaginated($perPage, $page, $active);
        $total = $this->categoryRepository->count($active);

        return [
            'categories' => $categories,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }
}
