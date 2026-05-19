<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;

class ListTagsService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(int $perPage, int $page, ?string $search = null): array
    {
        $result = $this->tagRepository->findPaginated($perPage, $page, $search);

        return [
            'tags' => $result['data'],
            'total' => $result['total'],
            'perPage' => $perPage,
            'currentPage' => $page,
            'search' => $search,
        ];
    }
}
