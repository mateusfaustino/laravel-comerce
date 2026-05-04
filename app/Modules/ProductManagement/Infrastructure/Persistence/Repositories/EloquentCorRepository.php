<?php

namespace App\Modules\ProductManagement\Infrastructure\Persistence\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Cor as DomainCor;
use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentCorModel;
use Carbon\CarbonImmutable;

class EloquentCorRepository implements CorRepositoryInterface
{
    public function findById(int $id): ?DomainCor
    {
        $model = EloquentCorModel::find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function findByNome(string $nome): ?DomainCor
    {
        $model = EloquentCorModel::where('nome', $nome)->first();

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainCor $cor): DomainCor
    {
        $model = EloquentCorModel::create([
            'nome' => $cor->getNome(),
            'cod_rgb' => $cor->getCodRgb(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainCor $cor): DomainCor
    {
        $model = EloquentCorModel::findOrFail($cor->getId());

        $model->update([
            'nome' => $cor->getNome(),
            'cod_rgb' => $cor->getCodRgb(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    public function findAll(): array
    {
        return EloquentCorModel::orderBy('nome')
            ->get()
            ->map(fn (EloquentCorModel $m) => $this->toDomainEntity($m))
            ->all();
    }

    public function findPaginated(int $perPage, int $page): array
    {
        $models = EloquentCorModel::orderBy('nome')
            ->paginate($perPage, ['*'], 'page', $page);

        return $models->map(fn (EloquentCorModel $m) => $this->toDomainEntity($m))->all();
    }

    public function count(): int
    {
        return EloquentCorModel::count();
    }

    public function delete(int $id): void
    {
        $model = EloquentCorModel::findOrFail($id);
        $model->delete();
    }

    private function toDomainEntity(EloquentCorModel $model): DomainCor
    {
        $cor = new DomainCor(
            nome: $model->nome,
            codRgb: $model->cod_rgb,
        );

        $cor->setId($model->id);

        if ($model->created_at !== null) {
            $cor->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $cor->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $cor;
    }
}
