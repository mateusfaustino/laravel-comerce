<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Entities\Tag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;

class SearchTagsService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * @return array<Tag>
     */
    public function execute(string $term, int $limit = 10): array
    {
        if (trim($term) === '') {
            return [];
        }

        return $this->tagRepository->searchByDescription($term, $limit);
    }
}
