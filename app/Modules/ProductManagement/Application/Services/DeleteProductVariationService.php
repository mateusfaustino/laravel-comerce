<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DeleteProductVariationService
{
    public function __construct(
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    public function execute(int $id): void
    {
        $variation = $this->variationRepository->findById($id);

        if ($variation === null) {
            throw ValidationException::withMessages([
                'id' => ['Variacao nao encontrada.'],
            ]);
        }

        $this->variationRepository->delete($id);
    }
}
