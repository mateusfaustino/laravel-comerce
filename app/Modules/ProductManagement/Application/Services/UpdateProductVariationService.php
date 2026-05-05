<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Application\DTOs\UpdateProductVariationDTO;
use App\Modules\ProductManagement\Domain\Entities\ProductVariation;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateProductVariationService
{
    public function __construct(
        private ProductVariationRepositoryInterface $variationRepository,
    ) {}

    public function execute(UpdateProductVariationDTO $dto): ProductVariation
    {
        $existing = $this->variationRepository->findById($dto->id);

        if ($existing === null) {
            throw ValidationException::withMessages([
                'id' => ['Variacao nao encontrada.'],
            ]);
        }

        $existing->setProdutoId($dto->produtoId);
        $existing->setActive($dto->active);
        $existing->setQuantidadeEstoque($dto->quantidadeEstoque);
        $existing->setCorId($dto->corId);
        $existing->setTamanhoRoupaAdulto($dto->tamanhoRoupaAdulto);
        $existing->setTamanhoRoupaCrianca($dto->tamanhoRoupaCrianca);
        $existing->setTamanhoCalcado($dto->tamanhoCalcado);
        $existing->setSku($dto->sku);
        $existing->setPrecoVenda($dto->precoVenda);
        $existing->setPrecoPromocional($dto->precoPromocional);
        $existing->setCusto($dto->custo);

        $variation = $this->variationRepository->update($existing);

        if ($dto->fotoIds !== null) {
            $this->variationRepository->syncFotos($variation->getId(), $dto->fotoIds);
        }

        return $variation;
    }
}
