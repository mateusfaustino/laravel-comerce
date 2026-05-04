<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class UpdateCorDTO
{
    public function __construct(
        public int $id,
        public string $nome,
        public string $codRgb,
    ) {}
}
