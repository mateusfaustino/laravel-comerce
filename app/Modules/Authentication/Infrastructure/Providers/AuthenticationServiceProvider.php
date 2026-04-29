<?php

namespace App\Modules\Authentication\Infrastructure\Providers;

use App\Modules\Authentication\Domain\Repositories\PermissionRepositoryInterface;
use App\Modules\Authentication\Domain\Repositories\RoleRepositoryInterface;
use App\Modules\Authentication\Domain\Repositories\UserRepositoryInterface;
use App\Modules\Authentication\Infrastructure\Commands\SyncRolesPermissionsCommand;
use App\Modules\Authentication\Infrastructure\Persistence\Repositories\EloquentPermissionRepository;
use App\Modules\Authentication\Infrastructure\Persistence\Repositories\EloquentRoleRepository;
use App\Modules\Authentication\Infrastructure\Persistence\Repositories\EloquentUserRepository;
use Illuminate\Support\ServiceProvider;

class AuthenticationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );

        $this->app->bind(
            RoleRepositoryInterface::class,
            EloquentRoleRepository::class
        );

        $this->app->bind(
            PermissionRepositoryInterface::class,
            EloquentPermissionRepository::class
        );

        $this->mergeConfigFrom(
            __DIR__.'/../Config/Roles.php',
            'authentication.roles'
        );
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                SyncRolesPermissionsCommand::class,
            ]);
        }
    }
}
