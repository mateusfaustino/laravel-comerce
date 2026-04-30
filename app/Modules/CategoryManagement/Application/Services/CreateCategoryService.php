<?php

namespace App\Modules\CategoryManagement\Application\Services;

use App\Modules\CategoryManagement\Application\DTOs\CreateCategoryDTO;
use App\Modules\CategoryManagement\Domain\Entities\Category;
use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateCategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function execute(CreateCategoryDTO $dto): Category
    {
        $this->validate($dto);

        $category = new Category(
            name: $dto->name,
            slug: $dto->slug,
            parentId: $dto->parentId,
            active: $dto->active,
        );

        return $this->categoryRepository->save($category);
    }

    private function validate(CreateCategoryDTO $dto): void
    {
        $existing = $this->categoryRepository->findBySlug($dto->slug);

        if ($existing !== null) {
            throw ValidationException::withMessages([
                'slug' => ['O slug já está em uso.'],
            ]);
        }

        if ($dto->parentId !== null) {
            $parent = $this->categoryRepository->findById($dto->parentId);

            if ($parent === null) {
                throw ValidationException::withMessages([
                    'parent_id' => ['A categoria pai não existe.'],
                ]);
            }

            if ($parent->isSubcategory()) {
                throw ValidationException::withMessages([
                    'parent_id' => ['A categoria pai selecionada não é uma categoria de nível superior.'],
                ]);
            }
        }
    }
}
