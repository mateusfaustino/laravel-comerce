<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DeleteProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(int $id): void
    {
        $product = $this->productRepository->findById($id);

        if ($product === null) {
            throw ValidationException::withMessages([
                'id' => ['Produto nao encontrado.'],
            ]);
        }

        $this->productRepository->deactivate($id);
    }
}
