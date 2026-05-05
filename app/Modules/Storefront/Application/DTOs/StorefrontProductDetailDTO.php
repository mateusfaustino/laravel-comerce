<?php

namespace App\Modules\Storefront\Application\DTOs;

class StorefrontProductDetailDTO
{
    /**
     * @param  array<string>  $images
     * @param  array<string>  $colors
     * @param  array<string>  $sizes
     * @param  array<array<string, mixed>>  $variations
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $slug,
        public ?string $price,
        public ?string $promotionalPrice,
        public ?string $image,
        public ?string $categoryName,
        public ?string $categorySlug,
        public ?string $description,
        public array $images,
        public array $colors,
        public array $sizes,
        public array $variations,
        public bool $isNew = false,
        public bool $isFeatured = false,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'slug' => $this->slug,
            'price' => $this->price,
            'promotionalPrice' => $this->promotionalPrice,
            'image' => $this->image,
            'categoryName' => $this->categoryName,
            'categorySlug' => $this->categorySlug,
            'description' => $this->description,
            'images' => $this->images,
            'colors' => $this->colors,
            'sizes' => $this->sizes,
            'variations' => $this->variations,
            'isNew' => $this->isNew,
            'isFeatured' => $this->isFeatured,
        ];
    }
}
