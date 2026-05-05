<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class CreateProductDTO
{
    /**
     * @param  array<int>|null  $categoryIds
     * @param  array<array{cor_id?: int, tamanho_roupa_adulto?: string, tamanho_roupa_crianca?: string, tamanho_calcado?: string, sku?: string, quantidade_estoque?: int, preco_venda?: string, preco_promocional?: string, custo?: string, active?: bool}>|null  $variations
     */
    public function __construct(
        public string $nome,
        public string $slug,
        public string $tipoProduto,
        public string $estoqueTipo = 'LIMITADO',
        public ?string $descricao = null,
        public ?string $sku = null,
        public ?string $codigoBarras = null,
        public ?string $peso = null,
        public ?string $largura = null,
        public ?string $altura = null,
        public ?string $comprimento = null,
        public bool $active = true,
        public ?array $categoryIds = null,
        public ?array $variations = null,
    ) {}
}
