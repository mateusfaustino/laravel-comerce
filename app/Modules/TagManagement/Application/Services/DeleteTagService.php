<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Validation\ValidationException;

class DeleteTagService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(int $id): void
    {
        $existing = $this->tagRepository->findById($id);

        if ($existing === null) {
            throw ValidationException::withMessages([
                'id' => ['Tag nao encontrada.'],
            ]);
        }

        $this->tagRepository->delete($id);
    }
}
