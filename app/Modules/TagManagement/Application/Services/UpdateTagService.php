<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Application\DTOs\UpdateTagDTO;
use App\Modules\TagManagement\Domain\Entities\Tag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateTagService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(UpdateTagDTO $dto): Tag
    {
        $existing = $this->tagRepository->findById($dto->id);

        if ($existing === null) {
            throw ValidationException::withMessages([
                'id' => ['Tag nao encontrada.'],
            ]);
        }

        $normalized = Tag::normalize($dto->description);

        if ($normalized === '') {
            throw ValidationException::withMessages([
                'description' => ['A descricao da tag e obrigatoria.'],
            ]);
        }

        $owner = $this->tagRepository->findByDescription($normalized);
        if ($owner !== null && $owner->getId() !== $dto->id) {
            throw ValidationException::withMessages([
                'description' => ['Ja existe uma tag com esta descricao.'],
            ]);
        }

        $existing->setDescription($normalized);

        return $this->tagRepository->update($existing);
    }
}
