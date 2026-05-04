<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DeleteCorService
{
    public function __construct(
        private CorRepositoryInterface $corRepository,
    ) {}

    public function execute(int $id): void
    {
        $cor = $this->corRepository->findById($id);

        if ($cor === null) {
            throw ValidationException::withMessages([
                'id' => ['Cor nao encontrada.'],
            ]);
        }

        $this->corRepository->delete($id);
    }
}
