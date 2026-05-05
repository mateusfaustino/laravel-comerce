<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class UpdateProductVariationDTO
{
    /**
     * @param  array<int>|null  $fotoIds
     */
    public function __construct(
        public int $id,
        public int $produtoId,
        public bool $active = true,
        public int $quantidadeEstoque = 0,
        public ?int $corId = null,
        public ?string $tamanhoRoupaAdulto = null,
        public ?string $tamanhoRoupaCrianca = null,
        public ?string $tamanhoCalcado = null,
        public ?string $sku = null,
        public ?string $precoVenda = null,
        public ?string $precoPromocional = null,
        public ?string $custo = null,
        public ?array $fotoIds = null,
    ) {}
}
