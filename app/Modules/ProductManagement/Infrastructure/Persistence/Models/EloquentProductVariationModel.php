<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EloquentProductVariationModel extends Model
{
    protected $table = 'produto_variacoes';

    protected $fillable = [
        'produto_id',
        'cor_id',
        'tamanho_roupa_adulto',
        'tamanho_roupa_crianca',
        'tamanho_calcado',
        'active',
        'quantidade_estoque',
        'sku',
        'preco_venda',
        'preco_promocional',
        'custo',
    ];

    protected $casts = [
        'active' => 'boolean',
        'preco_venda' => 'decimal:2',
        'preco_promocional' => 'decimal:2',
        'custo' => 'decimal:2',
    ];

    public function produto(): BelongsTo
    {
        return $this->belongsTo(EloquentProductModel::class, 'produto_id');
    }

    public function cor(): BelongsTo
    {
        return $this->belongsTo(EloquentCorModel::class, 'cor_id');
    }

    public function fotos(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentFotoModel::class,
            'produto_variacoes_fotos',
            'produto_variacao_id',
            'foto_id'
        );
    }
}
