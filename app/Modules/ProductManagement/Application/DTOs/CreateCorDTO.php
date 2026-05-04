<?php

namespace App\Modules\ProductManagement\Application\DTOs;

class CreateCorDTO
{
    public function __construct(
        public string $nome,
        public string $codRgb,
    ) {}
}
