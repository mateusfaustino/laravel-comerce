<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Application\DTOs\CreateTagDTO;
use App\Modules\TagManagement\Domain\Entities\Tag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CreateTagService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(CreateTagDTO $dto): Tag
    {
        $normalized = Tag::normalize($dto->description);

        if ($normalized === '') {
            throw ValidationException::withMessages([
                'description' => ['A descricao da tag e obrigatoria.'],
            ]);
        }

        $existing = $this->tagRepository->findByDescription($normalized);

        if ($existing !== null) {
            throw ValidationException::withMessages([
                'description' => ['Ja existe uma tag com esta descricao.'],
            ]);
        }

        $tag = new Tag(description: $normalized);

        return $this->tagRepository->save($tag);
    }
}
