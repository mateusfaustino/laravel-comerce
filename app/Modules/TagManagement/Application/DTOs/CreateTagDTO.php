<?php

namespace App\Modules\TagManagement\Application\DTOs;

class CreateTagDTO
{
    public function __construct(
        public string $description,
    ) {}
}
