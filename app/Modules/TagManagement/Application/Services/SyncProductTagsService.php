<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Entities\Tag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;

class SyncProductTagsService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * Sync tags for a product. Accepts mixed payload of integer ids and
     * string descriptions (new tags will be created on-the-fly via folksonomy).
     *
     * @param  array<int, int|string>  $tagsPayload
     * @return array<int>  Final array of tag ids associated with the product.
     */
    public function execute(int $productId, array $tagsPayload): array
    {
        $tagIds = [];

        foreach ($tagsPayload as $item) {
            if (is_int($item) || (is_string($item) && ctype_digit($item))) {
                $tagIds[] = (int) $item;

                continue;
            }

            if (is_string($item)) {
                $normalized = Tag::normalize($item);
                if ($normalized === '') {
                    continue;
                }
                $tag = $this->tagRepository->findOrCreateByDescription($normalized);
                $id = $tag->getId();
                if ($id !== null) {
                    $tagIds[] = $id;
                }
            }
        }

        $tagIds = array_values(array_unique($tagIds));

        $this->tagRepository->syncProductTags($productId, $tagIds);

        return $tagIds;
    }
}
