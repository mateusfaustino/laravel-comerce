<?php

namespace App\Modules\CategoryManagement\Application\Services;

use App\Modules\CategoryManagement\Application\DTOs\UpdateCategoryDTO;
use App\Modules\CategoryManagement\Domain\Entities\Category;
use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateCategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function execute(UpdateCategoryDTO $dto): Category
    {
        $category = $this->categoryRepository->findById($dto->id);

        if ($category === null) {
            throw ValidationException::withMessages([
                'id' => ['Categoria não encontrada.'],
            ]);
        }

        $this->validate($dto, $category);

        $category->setName($dto->name);
        $category->setSlug($dto->slug);
        $category->setParentId($dto->parentId);
        $category->setActive($dto->active);

        return $this->categoryRepository->update($category);
    }

    private function validate(UpdateCategoryDTO $dto, Category $current): void
    {
        $existing = $this->categoryRepository->findBySlug($dto->slug);

        if ($existing !== null && $existing->getId() !== $dto->id) {
            throw ValidationException::withMessages([
                'slug' => ['O slug já está em uso por outra categoria.'],
            ]);
        }

        // Changing from category to sub-category: must not have children
        if ($dto->parentId !== null && ! $current->isSubcategory()) {
            $children = $this->categoryRepository->findChildren($dto->id);

            if (count($children) > 0) {
                throw ValidationException::withMessages([
                    'parent_id' => ['Esta categoria possui sub-categorias e não pode ser convertida em sub-categoria.'],
                ]);
            }
        }

        if ($dto->parentId !== null) {
            if ($dto->parentId === $dto->id) {
                throw ValidationException::withMessages([
                    'parent_id' => ['Uma categoria não pode ser pai de si mesma.'],
                ]);
            }

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
