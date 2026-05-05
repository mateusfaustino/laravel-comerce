<?php

namespace App\Modules\Storefront\Application\DTOs;

class StorefrontCategoryDTO
{
    /**
     * @param  array<array{name: string, slug: string}>  $subcategories
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public ?string $image,
        public ?string $description,
        public array $subcategories,
        public int $productCount,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'image' => $this->image,
            'description' => $this->description,
            'subcategories' => $this->subcategories,
            'productCount' => $this->productCount,
        ];
    }
}
