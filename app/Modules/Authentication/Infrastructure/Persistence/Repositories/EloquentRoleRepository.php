<?php

namespace App\Modules\Authentication\Infrastructure\Persistence\Repositories;

use App\Modules\Authentication\Domain\Entities\Role as DomainRole;
use App\Modules\Authentication\Domain\Repositories\RoleRepositoryInterface;
use App\Modules\Authentication\Infrastructure\Persistence\Models\EloquentRoleModel;
use Carbon\CarbonImmutable;

class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function findBySlug(string $slug): ?DomainRole
    {
        $model = EloquentRoleModel::where('slug', $slug)->first();

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function findById(int $id): ?DomainRole
    {
        $model = EloquentRoleModel::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toDomainEntity($model);
    }

    public function save(DomainRole $role): DomainRole
    {
        $model = EloquentRoleModel::create([
            'slug' => $role->getSlug(),
            'name' => $role->getName(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainRole $role): DomainRole
    {
        $model = EloquentRoleModel::findOrFail($role->getId());

        $model->update([
            'slug' => $role->getSlug(),
            'name' => $role->getName(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    /**
     * @return array<DomainRole>
     */
    public function findAll(): array
    {
        $models = EloquentRoleModel::all();

        return $models->map(fn (EloquentRoleModel $model) => $this->toDomainEntity($model))->all();
    }

    public function syncPermissions(int $roleId, array $permissionIds): void
    {
        $model = EloquentRoleModel::find($roleId);

        if ($model !== null) {
            $model->permissions()->sync($permissionIds);
        }
    }

    private function toDomainEntity(EloquentRoleModel $model): DomainRole
    {
        $role = new DomainRole(
            slug: $model->slug,
            name: $model->name,
        );

        $role->setId($model->id);

        if ($model->created_at !== null) {
            $role->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $role->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $role;
    }
}
