<?php

namespace App\Modules\Authentication\Infrastructure\Repositories;

use App\Modules\Authentication\Domain\Entities\Permission as DomainPermission;
use App\Modules\Authentication\Domain\Repositories\PermissionRepositoryInterface;
use App\Modules\Authentication\Infrastructure\Models\EloquentPermissionModel;
use Carbon\CarbonImmutable;

class EloquentPermissionRepository implements PermissionRepositoryInterface
{
    public function findBySlug(string $slug): ?DomainPermission
    {
        $model = EloquentPermissionModel::where('slug', $slug)->first();

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function findById(int $id): ?DomainPermission
    {
        $model = EloquentPermissionModel::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function save(DomainPermission $permission): DomainPermission
    {
        $model = EloquentPermissionModel::create([
            'slug' => $permission->getSlug(),
            'description' => $permission->getDescription(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainPermission $permission): DomainPermission
    {
        $model = EloquentPermissionModel::findOrFail($permission->getId());

        $model->update([
            'slug' => $permission->getSlug(),
            'description' => $permission->getDescription(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    /**
     * @return array<DomainPermission>
     */
    public function findAll(): array
    {
        $models = EloquentPermissionModel::all();

        return $models->map(fn (EloquentPermissionModel $model) => $this->toDomainEntity($model))->all();
    }

    private function toDomainEntity(EloquentPermissionModel $model): DomainPermission
    {
        $permission = new DomainPermission(
            slug: $model->slug,
            description: $model->description,
        );

        $permission->setId($model->id);

        if ($model->created_at !== null) {
            $permission->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $permission->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $permission;
    }
}
