<?php

namespace App\Modules\Authentication\Infrastructure\Commands;

use App\Modules\Authentication\Domain\Entities\Permission;
use App\Modules\Authentication\Domain\Entities\Role;
use App\Modules\Authentication\Domain\Repositories\PermissionRepositoryInterface;
use App\Modules\Authentication\Domain\Repositories\RoleRepositoryInterface;
use Illuminate\Console\Command;

class SyncRolesPermissionsCommand extends Command
{
    protected $signature = 'auth:sync-roles-permissions';

    protected $description = 'Synchronize roles and permissions from config file to the database';

    public function handle(
        RoleRepositoryInterface $roleRepository,
        PermissionRepositoryInterface $permissionRepository,
    ): int {
        $config = config('authentication.roles', []);

        if (empty($config)) {
            $this->error('No roles configuration found. Check app/Modules/Authentication/Infrastructure/Config/Roles.php');

            return self::FAILURE;
        }

        $permissionIdMap = [];

        foreach ($config as $roleSlug => $roleData) {
            // Sync permissions for this role
            $permissionIds = [];

            foreach ($roleData['permissions'] as $permissionSlug) {
                $existingPermission = $permissionRepository->findBySlug($permissionSlug);

                if ($existingPermission === null) {
                    $newPermission = new Permission(
                        slug: $permissionSlug,
                        description: $permissionSlug,
                    );

                    $existingPermission = $permissionRepository->save($newPermission);
                    $this->info("  Created permission: {$permissionSlug}");
                }

                $permissionIds[] = $existingPermission->getId();
            }

            $permissionIdMap[$roleSlug] = $permissionIds;

            // Sync role
            $existingRole = $roleRepository->findBySlug($roleSlug);

            if ($existingRole === null) {
                $newRole = new Role(
                    slug: $roleSlug,
                    name: $roleData['name'],
                );

                $existingRole = $roleRepository->save($newRole);
                $this->info("Created role: {$roleSlug}");
            } else {
                if ($existingRole->getName() !== $roleData['name']) {
                    $existingRole->setName($roleData['name']);
                    $roleRepository->update($existingRole);
                    $this->info("Updated role name: {$roleSlug} → {$roleData['name']}");
                }
            }

            // Sync role-permission relationships
            $roleRepository->syncPermissions($existingRole->getId(), $permissionIds);
        }

        // Remove roles not in config
        $allRoles = $roleRepository->findAll();
        $configSlugs = array_keys($config);

        foreach ($allRoles as $role) {
            if (! in_array($role->getSlug(), $configSlugs, true)) {
                $this->warn("Role '{$role->getSlug()}' exists in database but not in config. Consider removing it manually.");
            }
        }

        $this->info('Roles and permissions synchronized successfully.');

        return self::SUCCESS;
    }
}
