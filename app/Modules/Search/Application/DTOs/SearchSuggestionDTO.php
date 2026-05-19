<?php

namespace App\Modules\Search\Application\DTOs;

class SearchSuggestionDTO
{
    public function __construct(
        public string $type,   // 'product' | 'category' | 'tag'
        public string $label,
        public string $href,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'label' => $this->label,
            'href' => $this->href,
        ];
    }
}
