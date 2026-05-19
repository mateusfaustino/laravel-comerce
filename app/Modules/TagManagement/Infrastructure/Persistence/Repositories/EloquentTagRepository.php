<?php

namespace App\Modules\TagManagement\Infrastructure\Persistence\Repositories;

use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentProductModel;
use App\Modules\TagManagement\Domain\Entities\Tag as DomainTag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use App\Modules\TagManagement\Infrastructure\Persistence\Models\EloquentTagModel;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EloquentTagRepository implements TagRepositoryInterface
{
    public function findById(int $id): ?DomainTag
    {
        $model = EloquentTagModel::find($id);

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function findByDescription(string $description): ?DomainTag
    {
        $normalized = DomainTag::normalize($description);
        $model = EloquentTagModel::where('description', $normalized)->first();

        return $model ? $this->toDomainEntity($model) : null;
    }

    public function save(DomainTag $tag): DomainTag
    {
        $model = EloquentTagModel::create([
            'description' => $tag->getDescription(),
        ]);

        return $this->toDomainEntity($model);
    }

    public function update(DomainTag $tag): DomainTag
    {
        $model = EloquentTagModel::findOrFail($tag->getId());

        $model->update([
            'description' => $tag->getDescription(),
        ]);

        return $this->toDomainEntity($model->fresh());
    }

    public function delete(int $id): void
    {
        $model = EloquentTagModel::findOrFail($id);
        $model->delete();
    }

    public function findAll(): array
    {
        return EloquentTagModel::orderBy('description')
            ->get()
            ->map(fn (EloquentTagModel $m) => $this->toDomainEntity($m))
            ->all();
    }

    public function findPaginated(int $perPage, int $page, ?string $search = null): array
    {
        $query = EloquentTagModel::query()->orderBy('description');

        if ($search !== null && $search !== '') {
            $term = DomainTag::normalize($search);
            $query->where('description', 'like', '%'.$term.'%');
        }

        $total = (clone $query)->count();
        $models = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return [
            'data' => $models->map(fn (EloquentTagModel $m) => $this->toDomainEntity($m))->all(),
            'total' => $total,
        ];
    }

    public function count(?string $search = null): int
    {
        $query = EloquentTagModel::query();

        if ($search !== null && $search !== '') {
            $term = DomainTag::normalize($search);
            $query->where('description', 'like', '%'.$term.'%');
        }

        return $query->count();
    }

    public function searchByDescription(string $term, int $limit = 10): array
    {
        $normalized = DomainTag::normalize($term);

        $models = EloquentTagModel::where('description', 'like', '%'.$normalized.'%')
            ->orderBy('description')
            ->limit($limit)
            ->get();

        return $models->map(fn (EloquentTagModel $m) => $this->toDomainEntity($m))->all();
    }

    public function findByProductId(int $productId): array
    {
        $models = EloquentTagModel::query()
            ->join('produtos_tags', 'produtos_tags.tag_id', '=', 'tags.id')
            ->where('produtos_tags.produto_id', $productId)
            ->orderBy('tags.description')
            ->select('tags.*')
            ->get();

        return $models->map(fn (EloquentTagModel $m) => $this->toDomainEntity($m))->all();
    }

    public function attachToProduct(int $tagId, int $productId): void
    {
        $tag = EloquentTagModel::findOrFail($tagId);
        $tag->produtos()->syncWithoutDetaching([$productId]);
    }

    public function detachFromProduct(int $tagId, int $productId): void
    {
        $tag = EloquentTagModel::findOrFail($tagId);
        $tag->produtos()->detach($productId);
    }

    public function syncProductTags(int $productId, array $tagIds): void
    {
        $product = EloquentProductModel::findOrFail($productId);
        /** @phpstan-ignore-next-line */
        $product->tags()->sync($tagIds);
    }

    public function findOrCreateByDescription(string $description): DomainTag
    {
        $normalized = DomainTag::normalize($description);

        $model = EloquentTagModel::firstOrCreate(
            ['description' => $normalized],
            ['description' => $normalized]
        );

        return $this->toDomainEntity($model);
    }

    public function getProductsByTagId(int $tagId): array
    {
        $rows = DB::table('produtos_tags')
            ->join('produtos', 'produtos.id', '=', 'produtos_tags.produto_id')
            ->leftJoin('fotos', 'fotos.id', '=', 'produtos.thumbnail_foto_id')
            ->where('produtos_tags.tag_id', $tagId)
            ->orderBy('produtos.nome')
            ->select('produtos.id', 'produtos.nome', 'produtos.slug', 'fotos.path as image')
            ->get();

        return $rows->map(function ($row) {
            $imageUrl = null;
            if (! empty($row->image)) {
                $imageUrl = Storage::disk('public')->url($row->image);
            }

            return [
                'id' => (int) $row->id,
                'nome' => (string) $row->nome,
                'slug' => (string) $row->slug,
                'image' => $imageUrl,
            ];
        })->all();
    }

    public function countProductsByTagId(int $tagId): int
    {
        return DB::table('produtos_tags')
            ->where('tag_id', $tagId)
            ->count();
    }

    private function toDomainEntity(EloquentTagModel $model): DomainTag
    {
        $tag = new DomainTag(description: $model->description);

        $tag->setId($model->id);

        if ($model->created_at !== null) {
            $tag->setCreatedAt(CarbonImmutable::parse($model->created_at));
        }

        if ($model->updated_at !== null) {
            $tag->setUpdatedAt(CarbonImmutable::parse($model->updated_at));
        }

        return $tag;
    }
}
