<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\CreateCorDTO;
use App\Modules\ProductManagement\Domain\Entities\Cor;
use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateCorService
{
    public function __construct(
        private CorRepositoryInterface $corRepository,
    ) {}

    public function execute(CreateCorDTO $dto): Cor
    {
        $existing = $this->corRepository->findByNome($dto->nome);

        if ($existing !== null) {
            throw ValidationException::withMessages([
                'nome' => ['Ja existe uma cor com este nome.'],
            ]);
        }

        $cor = new Cor(
            nome: $dto->nome,
            codRgb: $dto->codRgb,
        );

        return $this->corRepository->save($cor);
    }
}
