<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EloquentCorModel extends Model
{
    protected $table = 'cores';

    protected $fillable = [
        'nome',
        'cod_rgb',
    ];

    public function variacoes(): HasMany
    {
        return $this->hasMany(EloquentProductVariationModel::class, 'cor_id');
    }
}
