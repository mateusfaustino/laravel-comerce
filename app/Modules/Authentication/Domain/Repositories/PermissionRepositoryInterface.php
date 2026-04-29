<?php

namespace App\Modules\Authentication\Domain\Repositories;

use App\Modules\Authentication\Domain\Entities\Permission;

interface PermissionRepositoryInterface
{
    public function findBySlug(string $slug): ?Permission;

    public function findById(int $id): ?Permission;

    public function save(Permission $permission): Permission;

    public function update(Permission $permission): Permission;

    /**
     * @return array<Permission>
     */
    public function findAll(): array;
}
