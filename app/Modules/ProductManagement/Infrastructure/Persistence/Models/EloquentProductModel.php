<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Models;

use App\Modules\CategoryManagement\Infrastructure\Persistence\Models\EloquentCategoryModel;
use App\Modules\TagManagement\Infrastructure\Persistence\Models\EloquentTagModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EloquentProductModel extends Model
{
    protected $table = 'produtos';

    protected $fillable = [
        'nome',
        'slug',
        'descricao',
        'estoque_tipo',
        'sku',
        'codigo_barras',
        'peso',
        'largura',
        'altura',
        'comprimento',
        'active',
        'tipo_produto',
        'thumbnail_foto_id',
    ];

    protected $casts = [
        'active' => 'boolean',
        'peso' => 'decimal:2',
        'largura' => 'decimal:2',
        'altura' => 'decimal:2',
        'comprimento' => 'decimal:2',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentCategoryModel::class,
            'produtos_categorias',
            'product_id',
            'category_id'
        );
    }

    public function fotos(): HasMany
    {
        return $this->hasMany(EloquentFotoModel::class, 'product_id');
    }

    public function variacoes(): HasMany
    {
        return $this->hasMany(EloquentProductVariationModel::class, 'produto_id');
    }

    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(EloquentFotoModel::class, 'thumbnail_foto_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(
            EloquentTagModel::class,
            'produtos_tags',
            'produto_id',
            'tag_id'
        )->withTimestamps();
    }
}
