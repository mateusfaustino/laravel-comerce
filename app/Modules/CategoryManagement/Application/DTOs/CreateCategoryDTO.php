<?php

namespace App\Modules\CategoryManagement\Application\DTOs;

class CreateCategoryDTO
{
    public function __construct(
        public string $name,
        public string $slug,
        public ?int $parentId = null,
        public bool $active = true,
    ) {}
}
