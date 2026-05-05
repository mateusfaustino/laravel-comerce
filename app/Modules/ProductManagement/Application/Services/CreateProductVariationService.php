<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\CreateProductVariationDTO;
use App\Modules\ProductManagement\Domain\Entities\ProductVariation;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateProductVariationService
{
    public function __construct(
        private ProductVariationRepositoryInterface $variationRepository,
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(CreateProductVariationDTO $dto): ProductVariation
    {
        $product = $this->productRepository->findById($dto->produtoId);

        if ($product === null) {
            throw ValidationException::withMessages([
                'produto_id' => ['Produto nao encontrado.'],
            ]);
        }

        $this->validateByTipoProduto($dto, $product->getTipoProduto());

        $variation = new ProductVariation(
            produtoId: $dto->produtoId,
            active: $dto->active,
            quantidadeEstoque: $dto->quantidadeEstoque,
            corId: $dto->corId,
            tamanhoRoupaAdulto: $dto->tamanhoRoupaAdulto,
            tamanhoRoupaCrianca: $dto->tamanhoRoupaCrianca,
            tamanhoCalcado: $dto->tamanhoCalcado,
            sku: $dto->sku,
            precoVenda: $dto->precoVenda,
            precoPromocional: $dto->precoPromocional,
            custo: $dto->custo,
        );

        $variation = $this->variationRepository->save($variation);

        if ($dto->fotoIds !== null) {
            $this->variationRepository->syncFotos($variation->getId(), $dto->fotoIds);
        }

        return $variation;
    }

    private function validateByTipoProduto(CreateProductVariationDTO $dto, string $tipoProduto): void
    {
        if ($tipoProduto === 'ROUPA_ADULTO') {
            if ($dto->tamanhoRoupaAdulto === null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_adulto' => ['O tamanho de roupa adulto e obrigatorio para este tipo de produto.'],
                ]);
            }
            if ($dto->tamanhoCalcado !== null) {
                throw ValidationException::withMessages([
                    'tamanho_calcado' => ['Tamanho de calcado nao e aplicavel para roupa adulto.'],
                ]);
            }
            if ($dto->tamanhoRoupaCrianca !== null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_crianca' => ['Tamanho de roupa crianca nao e aplicavel para roupa adulto.'],
                ]);
            }
        }

        if ($tipoProduto === 'ROUPA_CRIANCA') {
            if ($dto->tamanhoRoupaCrianca === null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_crianca' => ['O tamanho de roupa crianca e obrigatorio para este tipo de produto.'],
                ]);
            }
            if ($dto->tamanhoCalcado !== null) {
                throw ValidationException::withMessages([
                    'tamanho_calcado' => ['Tamanho de calcado nao e aplicavel para roupa crianca.'],
                ]);
            }
            if ($dto->tamanhoRoupaAdulto !== null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_adulto' => ['Tamanho de roupa adulto nao e aplicavel para roupa crianca.'],
                ]);
            }
        }

        if ($tipoProduto === 'CALCADO') {
            if ($dto->tamanhoCalcado === null) {
                throw ValidationException::withMessages([
                    'tamanho_calcado' => ['O tamanho de calcado e obrigatorio para este tipo de produto.'],
                ]);
            }
            if ($dto->tamanhoRoupaAdulto !== null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_adulto' => ['Tamanho de roupa adulto nao e aplicavel para calcado.'],
                ]);
            }
            if ($dto->tamanhoRoupaCrianca !== null) {
                throw ValidationException::withMessages([
                    'tamanho_roupa_crianca' => ['Tamanho de roupa crianca nao e aplicavel para calcado.'],
                ]);
            }
        }
    }
}
