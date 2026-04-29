<?php

namespace App\Modules\Authentication\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EloquentRoleModel extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'slug',
        'name',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentPermissionModel::class,
            'role_permissions',
            'role_id',
            'permission_id'
        )->withTimestamps();
    }
}
