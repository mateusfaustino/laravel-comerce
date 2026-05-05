<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Repositories;

use App\Modules\ProductManagement\Domain\Entities\ProductVariation as DomainVariation;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentProductVariationModel;
use Carbon\CarbonImmutable;

class EloquentProductVariationRepository implements ProductVariationRepositoryInterface
{
    public function findById(int $id): ?DomainVariation
    {
        $model = EloquentProductVariationModel::with('cor')->find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainVariation $variation): DomainVariation
    {
        $model = EloquentProductVariationModel::create([
            'produto_id' => $variation->getProdutoId(),
            'cor_id' => $variation->getCorId(),
            'tamanho_roupa_adulto' => $variation->getTamanhoRoupaAdulto(),
            'tamanho_roupa_crianca' => $variation->getTamanhoRoupaCrianca(),
            'tamanho_calcado' => $variation->getTamanhoCalcado(),
            'active' => $variation->isActive(),
            'quantidade_estoque' => $variation->getQuantidadeEstoque(),
            'sku' => $variation->getSku(),
            'preco_venda' => $variation->getPrecoVenda(),
            'preco_promocional' => $variation->getPrecoPromocional(),
            'custo' => $variation->getCusto(),
        ]);

        return $this->toDomainEntity($model->load('cor'));
    }

    public function update(DomainVariation $variation): DomainVariation
    {
        $model = EloquentProductVariationModel::findOrFail($variation->getId());

        $model->update([
            'produto_id' => $variation->getProdutoId(),
            'cor_id' => $variation->getCorId(),
            'tamanho_roupa_adulto' => $variation->getTamanhoRoupaAdulto(),
            'tamanho_roupa_crianca' => $variation->getTamanhoRoupaCrianca(),
            'tamanho_calcado' => $variation->getTamanhoCalcado(),
            'active' => $variation->isActive(),
            'quantidade_estoque' => $variation->getQuantidadeEstoque(),
            'sku' => $variation->getSku(),
            'preco_venda' => $variation->getPrecoVenda(),
            'preco_promocional' => $variation->getPrecoPromocional(),
            'custo' => $variation->getCusto(),
        ]);

        return $this->toDomainEntity($model->fresh()->load('cor'));
    }

    public function findByProductId(int $productId, ?bool $active = null): array
    {
        $query = EloquentProductVariationModel::where('produto_id', $productId)->with('cor');

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->orderBy('id')->get()->map(fn (EloquentProductVariationModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findByProductIdPaginated(int $productId, int $perPage, int $page, ?bool $active = null): array
    {
        $query = EloquentProductVariationModel::where('produto_id', $productId)->with('cor');

        if ($active !== null) {
            $query->where('active', $active);
        }

        $models = $query->orderBy('id')->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentProductVariationModel $m) => $this->toDomainEntity($m))->all();
    }

    public function countByProductId(int $productId, ?bool $active = null): int
    {
        $query = EloquentProductVariationModel::where('produto_id', $productId);

        if ($active !== null) {
            $query->where('active', $active);
        }

        return $query->count();
    }

    public function delete(int $id): void
    {
        $model = EloquentProductVariationModel::findOrFail($id);
        $model->fotos()->detach();
        $model->delete();
    }

    public function deactivate(int $id): void
    {
        $model = EloquentProductVariationModel::findOrFail($id);
        $model->update(['active' => false]);
    }

    public function activate(int $id): void
    {
        $model = EloquentProductVariationModel::findOrFail($id);
        $model->update(['active' => true]);
    }

    public function syncFotos(int $variationId, array $fotoIds): void
    {
        $model = EloquentProductVariationModel::findOrFail($variationId);
        $model->fotos()->sync($fotoIds);
    }

    public function getFotoIds(int $variationId): array
    {
        $model = EloquentProductVariationModel::with('fotos')->findOrFail($variationId);

        return $model->fotos->pluck('id')->toArray();
    }

    private function toDomainEntity(EloquentProductVariationModel $model): DomainVariation
    {
        $variation = new DomainVariation(
            produtoId: $model->produto_id,
            active: $model->active,
            quantidadeEstoque: $model->quantidade_estoque,
            corId: $model->cor_id,
            tamanhoRoupaAdulto: $model->tamanho_roupa_adulto,
            tamanhoRoupaCrianca: $model->tamanho_roupa_crianca,
            tamanhoCalcado: $model->tamanho_calcado,
            sku: $model->sku,
            precoVenda: $model->preco_venda,
            precoPromocional: $model->preco_promocional,
            custo: $model->custo,
        );

        $variation->setId($model->id);

        if ($model->relationLoaded('cor') && $model->cor) {
            $variation->setCorNome($model->cor->nome);
            $variation->setCorCodRgb($model->cor->cod_rgb);
        }

        if ($model->created_at !== null) {
            $variation->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $variation->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $variation;
    }
}
