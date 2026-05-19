<?php

namespace App\Modules\TagManagement\Application\DTOs;

class UpdateTagDTO
{
    public function __construct(
        public int $id,
        public string $description,
    ) {}
}
