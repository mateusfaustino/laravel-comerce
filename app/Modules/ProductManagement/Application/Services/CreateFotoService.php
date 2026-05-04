<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\CreateFotoDTO;
use App\Modules\ProductManagement\Domain\Entities\Foto;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateFotoService
{
    public function __construct(
        private FotoRepositoryInterface $fotoRepository,
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(CreateFotoDTO $dto): Foto
    {
        $product = $this->productRepository->findById($dto->productId);

        if ($product === null) {
            throw ValidationException::withMessages([
                'product_id' => ['Produto nao encontrado.'],
            ]);
        }

        $foto = new Foto(
            path: $dto->path,
            productId: $dto->productId,
            descricao: $dto->descricao,
            ordem: $dto->ordem,
        );

        return $this->fotoRepository->save($foto);
    }
}
