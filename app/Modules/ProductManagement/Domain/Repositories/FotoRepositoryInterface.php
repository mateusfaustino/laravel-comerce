<?php

namespace App\Modules\ProductManagement\Domain\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Foto;

interface FotoRepositoryInterface
{
    public function findById(int $id): ?Foto;

    public function save(Foto $foto): Foto;

    public function update(Foto $foto): Foto;

    /**
     * @return array<Foto>
     */
    public function findByProductId(int $productId): array;

    public function delete(int $id): void;
}
