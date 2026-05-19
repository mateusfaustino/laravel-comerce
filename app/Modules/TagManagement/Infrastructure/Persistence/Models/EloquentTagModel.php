<?php

namespace App\Modules\TagManagement\Infrastructure\Persistence\Models;

use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentProductModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EloquentTagModel extends Model
{
    protected $table = 'tags';

    protected $fillable = [
        'description',
    ];

    public function produtos(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentProductModel::class,
            'produtos_tags',
            'tag_id',
            'produto_id'
        )->withTimestamps();
    }
}
