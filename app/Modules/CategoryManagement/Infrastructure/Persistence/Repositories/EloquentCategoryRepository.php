<?php

namespace App\Modules\CategoryManagement\Infrastructure\Persistence\Repositories;

use App\Modules\CategoryManagement\Domain\Entities\Category as DomainCategory;
use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\CategoryManagement\Infrastructure\Persistence\Models\EloquentCategoryModel;
use Carbon\CarbonImmutable;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function findById(int $id): ?DomainCategory
    {
        $model = EloquentCategoryModel::find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function findBySlug(string $slug): ?DomainCategory
    {
        $model = EloquentCategoryModel::where('slug', $slug)->first();

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainCategory $category): DomainCategory
    {
        $model = EloquentCategoryModel::create([
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'parent_id' => $category->getParentId(),
            'active' => $category->isActive(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainCategory $category): DomainCategory
    {
        $model = EloquentCategoryModel::findOrFail($category->getId());

        $model->update([
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'parent_id' => $category->getParentId(),
            'active' => $category->isActive(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    public function findAll(?bool $active = null): array
    {
        $query = EloquentCategoryModel::query();

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->get()->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findPaginated(int $perPage, int $page, ?bool $active = null): array
    {
        $query = EloquentCategoryModel::query();

        if ($active !== null) {
            $query->where('active', $active);
        }

        $models = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function count(?bool $active = null): int
    {
        $query = EloquentCategoryModel::query();

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->count();
    }

    public function deactivate(int $id): void
    {
        $model = EloquentCategoryModel::findOrFail($id);
        $model->update(['active' => false]);
    }

    public function findRootCategories(?bool $active = null): array
    {
        $query = EloquentCategoryModel::whereNull('parent_id')
            ->with('children')
            ->orderBy('name');

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->get()->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findRootCategoriesPaginated(int $perPage, int $page, ?bool $active = null): array
    {
        $query = EloquentCategoryModel::whereNull('parent_id')
            ->withCount('children')
            ->orderBy('name');

        if ($active !== null) {
            $query->where('active', $active);
        }

        $models = $query->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function countRootCategories(?bool $active = null): int
    {
        $query = EloquentCategoryModel::whereNull('parent_id');

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->count();
    }

    public function findChildren(int $parentId): array
    {
        $models = EloquentCategoryModel::where('parent_id', $parentId)
            ->orderBy('name')
            ->get();

        return $models->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findChildrenPaginated(int $parentId, int $perPage, int $page): array
    {
        $models = EloquentCategoryModel::where('parent_id', $parentId)
            ->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    public function countChildren(int $parentId): int
    {
        return EloquentCategoryModel::where('parent_id', $parentId)->count();
    }

    public function findHierarchy(): array
    {
        $models = EloquentCategoryModel::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();

        return $models->map(fn (EloquentCategoryModel $m) => $this->toDomainEntity($m))->all();
    }

    private function toDomainEntity(EloquentCategoryModel $model): DomainCategory
    {
        $category = new DomainCategory(
            name: $model->name,
            slug: $model->slug,
            parentId: $model->parent_id,
            active: $model->active,
        );

        $category->setId($model->id);

        if ($model->created_at !== null) {
            $category->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $category->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        if (isset($model->children_count)) {
            $category->setChildrenCount($model->children_count);
        }

        return $category;
    }
}
