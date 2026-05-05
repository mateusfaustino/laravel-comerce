<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\UpdateProductDTO;
use App\Modules\ProductManagement\Domain\Entities\Product;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(UpdateProductDTO $dto): Product
    {
        $existing = $this->productRepository->findById($dto->id);

        if ($existing === null) {
            throw ValidationException::withMessages([
                'id' => ['Produto nao encontrado.'],
            ]);
        }

        $slugOwner = $this->productRepository->findBySlug($dto->slug);
        if ($slugOwner !== null && $slugOwner->getId() !== $dto->id) {
            throw ValidationException::withMessages([
                'slug' => ['O slug já está em uso.'],
            ]);
        }

        $existing->setNome($dto->nome);
        $existing->setSlug($dto->slug);
        $existing->setTipoProduto($dto->tipoProduto);
        $existing->setEstoqueTipo($dto->estoqueTipo);
        $existing->setDescricao($dto->descricao);
        $existing->setSku($dto->sku);
        $existing->setCodigoBarras($dto->codigoBarras);
        $existing->setPeso($dto->peso);
        $existing->setLargura($dto->largura);
        $existing->setAltura($dto->altura);
        $existing->setComprimento($dto->comprimento);
        $existing->setActive($dto->active);

        $product = $this->productRepository->update($existing);

        if ($dto->categoryIds !== null) {
            $this->productRepository->syncCategories($product->getId(), $dto->categoryIds);
        }

        if ($dto->thumbnailFotoId !== null) {
            $this->productRepository->updateThumbnail($product->getId(), $dto->thumbnailFotoId);
        }

        return $product;
    }
}
