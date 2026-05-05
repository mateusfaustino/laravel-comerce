<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Product as DomainProduct;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentProductModel;
use Carbon\CarbonImmutable;

class EloquentProductRepository implements ProductRepositoryInterface
{
    public function findById(int $id): ?DomainProduct
    {
        $model = EloquentProductModel::with('categories')->withCount('variacoes')->find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function findBySlug(string $slug): ?DomainProduct
    {
        $model = EloquentProductModel::where('slug', $slug)->first();

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainProduct $product): DomainProduct
    {
        $model = EloquentProductModel::create([
            'nome' => $product->getNome(),
            'slug' => $product->getSlug(),
            'tipo_produto' => $product->getTipoProduto(),
            'estoque_tipo' => $product->getEstoqueTipo(),
            'descricao' => $product->getDescricao(),
            'sku' => $product->getSku(),
            'codigo_barras' => $product->getCodigoBarras(),
            'peso' => $product->getPeso(),
            'largura' => $product->getLargura(),
            'altura' => $product->getAltura(),
            'comprimento' => $product->getComprimento(),
            'active' => $product->isActive(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainProduct $product): DomainProduct
    {
        $model = EloquentProductModel::findOrFail($product->getId());

        $model->update([
            'nome' => $product->getNome(),
            'slug' => $product->getSlug(),
            'tipo_produto' => $product->getTipoProduto(),
            'estoque_tipo' => $product->getEstoqueTipo(),
            'descricao' => $product->getDescricao(),
            'sku' => $product->getSku(),
            'codigo_barras' => $product->getCodigoBarras(),
            'peso' => $product->getPeso(),
            'largura' => $product->getLargura(),
            'altura' => $product->getAltura(),
            'comprimento' => $product->getComprimento(),
            'active' => $product->isActive(),
            'thumbnail_foto_id' => $product->getThumbnailFotoId(),
        ]);

        return $this->toDomainEntity($model->fresh()->load('categories'));
    }

    public function findAll(?bool $active = null): array
    {
        $query = EloquentProductModel::query();

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->get()->map(fn (EloquentProductModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findPaginated(int $perPage, int $page, ?bool $active = null): array
    {
        $query = EloquentProductModel::query()->withCount('variacoes');

        if ($active !== null) {
            $query->where('active', $active);
        }

        $models = $query->orderBy('nome')->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentProductModel $m) => $this->toDomainEntity($m))->all();
    }

    public function count(?bool $active = null): int
    {
        $query = EloquentProductModel::query();

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->count();
    }

    public function deactivate(int $id): void
    {
        $model = EloquentProductModel::findOrFail($id);
        $model->update(['active' => false]);
    }

    public function activate(int $id): void
    {
        $model = EloquentProductModel::findOrFail($id);
        $model->update(['active' => true]);
    }

    public function syncCategories(int $productId, array $categoryIds): void
    {
        $model = EloquentProductModel::findOrFail($productId);
        $model->categories()->sync($categoryIds);
    }

    public function getCategoryIds(int $productId): array
    {
        $model = EloquentProductModel::with('categories')->findOrFail($productId);

        return $model->categories->pluck('id')->toArray();
    }

    public function updateThumbnail(int $productId, ?int $fotoId): void
    {
        $model = EloquentProductModel::findOrFail($productId);
        $model->update(['thumbnail_foto_id' => $fotoId]);
    }

    public function findInactive(): array
    {
        return EloquentProductModel::where('active', false)
            ->orderBy('nome')
            ->get()
            ->map(fn (EloquentProductModel $m) => $this->toDomainEntity($m))
            ->all();
    }

    public function permanentlyDelete(int $id): void
    {
        $model = EloquentProductModel::findOrFail($id);
        $model->variacoes()->delete();
        $model->fotos()->delete();
        $model->categories()->detach();
        $model->delete();
    }

    private function toDomainEntity(EloquentProductModel $model): DomainProduct
    {
        $product = new DomainProduct(
            nome: $model->nome,
            slug: $model->slug,
            tipoProduto: $model->tipo_produto,
            estoqueTipo: $model->estoque_tipo,
            descricao: $model->descricao,
            sku: $model->sku,
            codigoBarras: $model->codigo_barras,
            peso: $model->peso,
            largura: $model->largura,
            altura: $model->altura,
            comprimento: $model->comprimento,
            active: $model->active,
        );

        $product->setId($model->id);
        $product->setThumbnailFotoId($model->thumbnail_foto_id);

        if ($model->created_at !== null) {
            $product->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $product->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        if (isset($model->variacoes_count)) {
            $product->setVariacoesCount($model->variacoes_count);
        }

        if ($model->relationLoaded('categories') && $model->categories) {
            $categoryIds = [];
            $categoryNames = [];
            foreach ($model->categories as $cat) {
                $categoryIds[] = $cat->id;
                $categoryNames[$cat->id] = $cat->name;
            }
            $product->setCategoryIds($categoryIds);
            $product->setCategoryNames($categoryNames);
        }

        return $product;
    }
}
