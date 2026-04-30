<?php

namespace App\Modules\CategoryManagement\Application\Services;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DeleteCategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function execute(int $id): void
    {
        $category = $this->categoryRepository->findById($id);

        if ($category === null) {
            throw ValidationException::withMessages([
                'id' => ['Categoria não encontrada.'],
            ]);
        }

        $this->categoryRepository->deactivate($id);
    }
}
