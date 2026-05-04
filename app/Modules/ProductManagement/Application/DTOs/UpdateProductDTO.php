<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class UpdateProductDTO
{
    /**
     * @param  array<int>|null  $categoryIds
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $slug,
        public string $tipoProduto,
        public string $estoqueTipo = 'LIMITADO',
        public ?string $descricao = null,
        public ?string $precoVenda = null,
        public ?string $precoPromocional = null,
        public ?string $custo = null,
        public ?string $sku = null,
        public ?string $codigoBarras = null,
        public ?string $peso = null,
        public ?string $largura = null,
        public ?string $altura = null,
        public ?string $comprimento = null,
        public bool $active = true,
        public ?array $categoryIds = null,
        public ?int $thumbnailFotoId = null,
    ) {}
}
