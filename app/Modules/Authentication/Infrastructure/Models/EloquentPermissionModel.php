<?php

namespace App\Modules\Authentication\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EloquentPermissionModel extends Model
{
    protected $table = 'permissions';

    protected $fillable = [
        'slug',
        'description',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentRoleModel::class,
            'role_permissions',
            'permission_id',
            'role_id'
        )->withTimestamps();
    }
}
