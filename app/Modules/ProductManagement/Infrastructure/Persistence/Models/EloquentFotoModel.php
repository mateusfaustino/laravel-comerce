<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EloquentFotoModel extends Model
{
    protected $table = 'fotos';

    protected $fillable = [
        'path',
        'descricao',
        'ordem',
        'product_id',
    ];

    public function produto(): BelongsTo
    {
        return $this->belongsTo(EloquentProductModel::class, 'product_id');
    }

    public function variacoes(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentProductVariationModel::class,
            'produto_variacoes_fotos',
            'foto_id',
            'produto_variacao_id'
        );
    }
}
