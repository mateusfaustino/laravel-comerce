<?php

namespace App\Modules\Storefront\Application\DTOs;

class StorefrontProductDTO
{
    /**
     * @param  array<string>  $colors
     * @param  array<string>  $sizes
     */
    public function __construct(
        public int $id,
        public string $nome,
        public string $slug,
        public ?string $price,
        public ?string $promotionalPrice,
        public ?string $image,
        public ?string $categoryName,
        public array $colors,
        public array $sizes,
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
            'colors' => $this->colors,
            'sizes' => $this->sizes,
            'isNew' => $this->isNew,
            'isFeatured' => $this->isFeatured,
        ];
    }
}
