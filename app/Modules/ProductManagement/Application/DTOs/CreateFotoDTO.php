<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class CreateFotoDTO
{
    public function __construct(
        public string $path,
        public int $productId,
        public ?string $descricao = null,
        public int $ordem = 0,
    ) {}
}
