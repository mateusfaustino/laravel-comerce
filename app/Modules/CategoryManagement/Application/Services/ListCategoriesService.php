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

    /**
     * @return array{categories: array, total: int, perPage: int, currentPage: int}
     */
    public function executeRootOnly(int $perPage = 15, int $page = 1, ?bool $active = null): array
    {
        $categories = $this->categoryRepository->findRootCategoriesPaginated($perPage, $page, $active);
        $total = $this->categoryRepository->countRootCategories($active);

        return [
            'categories' => $categories,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }

    /**
     * @return array{subcategories: array, total: int, perPage: int, currentPage: int}
     */
    public function executeChildren(int $parentId, int $perPage = 15, int $page = 1, ?bool $active = null): array
    {
        $subcategories = $this->categoryRepository->findChildrenPaginated($parentId, $perPage, $page, $active);
        $total = $this->categoryRepository->countChildren($parentId, $active);

        return [
            'subcategories' => $subcategories,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }
}
