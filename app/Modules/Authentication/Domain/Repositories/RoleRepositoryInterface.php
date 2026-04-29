<?php

namespace App\Modules\Authentication\Domain\Repositories;

use App\Modules\Authentication\Domain\Entities\Role;

interface RoleRepositoryInterface
{
    public function findBySlug(string $slug): ?Role;

    public function findById(int $id): ?Role;

    public function save(Role $role): Role;

    public function update(Role $role): Role;

    /**
     * @return array<Role>
     */
    public function findAll(): array;

    public function syncPermissions(int $roleId, array $permissionIds): void;
}
