<?php

namespace App\Modules\Authentication\Infrastructure\Seeders;

use App\Modules\Authentication\Domain\Entities\Permission;
use App\Modules\Authentication\Domain\Entities\Role;
use App\Modules\Authentication\Domain\Repositories\PermissionRepositoryInterface;
use App\Modules\Authentication\Domain\Repositories\RoleRepositoryInterface;
use App\Modules\Authentication\Infrastructure\Models\EloquentUserModel;
use Illuminate\Database\Seeder;

class AuthenticationSeeder extends Seeder
{
    /**
     * Run the database seeds for the Authentication module.
     */
    public function run(
        RoleRepositoryInterface $roleRepository,
        PermissionRepositoryInterface $permissionRepository,
    ): void {
        $rolesConfig = config('authentication.roles', []);

        foreach ($rolesConfig as $roleSlug => $roleData) {
            // Create permissions
            $permissionIds = [];
            foreach ($roleData['permissions'] as $permissionSlug) {
                $existingPermission = $permissionRepository->findBySlug($permissionSlug);
                if ($existingPermission === null) {
                    $permission = new Permission(
                        slug: $permissionSlug,
                        description: $permissionSlug,
                    );
                    $existingPermission = $permissionRepository->save($permission);
                }
                $permissionIds[] = $existingPermission->getId();
            }

            // Create role
            $existingRole = $roleRepository->findBySlug($roleSlug);
            if ($existingRole === null) {
                $role = new Role(
                    slug: $roleSlug,
                    name: $roleData['name'],
                );
                $existingRole = $roleRepository->save($role);
            }

            // Sync permissions to role
            $roleRepository->syncPermissions($existingRole->getId(), $permissionIds);

            // Create user for this role
            $email = strtolower($roleSlug).'@fabulosa.com';

            EloquentUserModel::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $roleData['name'],
                    'password' => 'password',
                    'role_id' => $existingRole->getId(),
                ]
            );
        }
    }
}
