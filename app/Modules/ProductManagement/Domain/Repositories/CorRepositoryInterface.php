<?php

namespace App\Modules\ProductManagement\Domain\Repositories;

use App\Modules\ProductManagement\Domain\Entities\Cor;

interface CorRepositoryInterface
{
    public function findById(int $id): ?Cor;

    public function findByNome(string $nome): ?Cor;

    public function save(Cor $cor): Cor;

    public function update(Cor $cor): Cor;

    /**
     * @return array<Cor>
     */
    public function findAll(): array;

    /**
     * @return array<Cor>
     */
    public function findPaginated(int $perPage, int $page): array;

    public function count(): int;

    public function delete(int $id): void;
}
