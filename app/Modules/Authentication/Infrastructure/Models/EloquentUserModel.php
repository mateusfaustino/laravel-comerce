<?php

namespace App\Modules\Authentication\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class EloquentUserModel extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected static string $factory = \Database\Factories\UserFactory::class;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(EloquentRoleModel::class, 'role_id');
    }

    public function hasPermission(string $permissionSlug): bool
    {
        return $this->role
            ? $this->role->permissions->contains('slug', $permissionSlug)
            : false;
    }

    public function hasRole(string $roleSlug): bool
    {
        return $this->role?->slug === $roleSlug;
    }
}
