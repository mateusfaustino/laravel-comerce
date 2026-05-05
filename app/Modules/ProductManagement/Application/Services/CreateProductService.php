<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\CreateProductDTO;
use App\Modules\ProductManagement\Domain\Entities\Product;
use App\Modules\ProductManagement\Domain\Entities\ProductVariation;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductVariationRepositoryInterface $variationRepository,
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

        if ($dto->variations !== null) {
            foreach ($dto->variations as $variationData) {
                $variation = new ProductVariation(
                    produtoId: $product->getId(),
                    active: $variationData['active'] ?? true,
                    quantidadeEstoque: $variationData['quantidade_estoque'] ?? 0,
                    corId: $variationData['cor_id'] ?? null,
                    tamanhoRoupaAdulto: $variationData['tamanho_roupa_adulto'] ?? null,
                    tamanhoRoupaCrianca: $variationData['tamanho_roupa_crianca'] ?? null,
                    tamanhoCalcado: $variationData['tamanho_calcado'] ?? null,
                    sku: $variationData['sku'] ?? null,
                    precoVenda: $variationData['preco_venda'] ?? null,
                    precoPromocional: $variationData['preco_promocional'] ?? null,
                    custo: $variationData['custo'] ?? null,
                );
                $this->variationRepository->save($variation);
            }
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
