<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\UpdateCorDTO;
use App\Modules\ProductManagement\Domain\Entities\Cor;
use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateCorService
{
    public function __construct(
        private CorRepositoryInterface $corRepository,
    ) {}

    public function execute(UpdateCorDTO $dto): Cor
    {
        $existing = $this->corRepository->findById($dto->id);

        if ($existing === null) {
            throw ValidationException::withMessages([
                'id' => ['Cor nao encontrada.'],
            ]);
        }

        $nomeOwner = $this->corRepository->findByNome($dto->nome);
        if ($nomeOwner !== null && $nomeOwner->getId() !== $dto->id) {
            throw ValidationException::withMessages([
                'nome' => ['Ja existe uma cor com este nome.'],
            ]);
        }

        $existing->setNome($dto->nome);
        $existing->setCodRgb($dto->codRgb);

        return $this->corRepository->update($existing);
    }
}
