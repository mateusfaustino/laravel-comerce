<?php

namespace App\Modules\CategoryManagement\Application\DTOs;

class UpdateCategoryDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public ?int $parentId = null,
        public bool $active = true,
    ) {}
}
