<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;

class DetachTagFromProductService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(int $tagId, int $productId): void
    {
        $this->tagRepository->detachFromProduct($tagId, $productId);
    }
}
