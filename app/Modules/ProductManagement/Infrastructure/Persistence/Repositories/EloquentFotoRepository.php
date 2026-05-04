<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Foto as DomainFoto;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentFotoModel;
use Carbon\CarbonImmutable;

class EloquentFotoRepository implements FotoRepositoryInterface
{
    public function findById(int $id): ?DomainFoto
    {
        $model = EloquentFotoModel::find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainFoto $foto): DomainFoto
    {
        $model = EloquentFotoModel::create([
            'path' => $foto->getPath(),
            'product_id' => $foto->getProductId(),
            'descricao' => $foto->getDescricao(),
            'ordem' => $foto->getOrdem(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainFoto $foto): DomainFoto
    {
        $model = EloquentFotoModel::findOrFail($foto->getId());

        $model->update([
            'path' => $foto->getPath(),
            'product_id' => $foto->getProductId(),
            'descricao' => $foto->getDescricao(),
            'ordem' => $foto->getOrdem(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    public function findByProductId(int $productId): array
    {
        return EloquentFotoModel::where('product_id', $productId)
            ->orderBy('ordem')
            ->get()
            ->map(fn (EloquentFotoModel $m) => $this->toDomainEntity($m))
            ->all();
    }

    public function delete(int $id): void
    {
        $model = EloquentFotoModel::findOrFail($id);
        $model->variacoes()->detach();
        $model->delete();
    }

    private function toDomainEntity(EloquentFotoModel $model): DomainFoto
    {
        $foto = new DomainFoto(
            path: $model->path,
            productId: $model->product_id,
            descricao: $model->descricao,
            ordem: $model->ordem,
        );

        $foto->setId($model->id);

        if ($model->created_at !== null) {
            $foto->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $foto->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $foto;
    }
}
