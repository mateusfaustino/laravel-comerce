<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\CreateProductDTO;
use App\Modules\ProductManagement\Domain\Entities\Product;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(CreateProductDTO $dto): Product
    {
        $this->validate($dto);

        $product = new Product(
            nome: $dto->nome,
            slug: $dto->slug,
            tipoProduto: $dto->tipoProduto,
            estoqueTipo: $dto->estoqueTipo,
            descricao: $dto->descricao,
            precoVenda: $dto->precoVenda,
            precoPromocional: $dto->precoPromocional,
            custo: $dto->custo,
            sku: $dto->sku,
            codigoBarras: $dto->codigoBarras,
            peso: $dto->peso,
            largura: $dto->largura,
            altura: $dto->altura,
            comprimento: $dto->comprimento,
            active: $dto->active,
        );

        $product = $this->productRepository->save($product);

        if ($dto->categoryIds !== null) {
            $this->productRepository->syncCategories($product->getId(), $dto->categoryIds);
        }

        return $product;
    }

    private function validate(CreateProductDTO $dto): void
    {
        $existing = $this->productRepository->findBySlug($dto->slug);

        if ($existing !== null) {
            throw ValidationException::withMessages([
                'slug' => ['O slug já está em uso.'],
            ]);
        }

        $validTipos = ['ROUPA_ADULTO', 'ROUPA_CRIANCA', 'CALCADO'];
        if (! in_array($dto->tipoProduto, $validTipos)) {
            throw ValidationException::withMessages([
                'tipo_produto' => ['Tipo de produto invalido.'],
            ]);
        }

        $validEstoqueTipos = ['INFINITO', 'LIMITADO'];
        if (! in_array($dto->estoqueTipo, $validEstoqueTipos)) {
            throw ValidationException::withMessages([
                'estoque_tipo' => ['Tipo de estoque invalido.'],
            ]);
        }
    }
}
