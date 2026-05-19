<?php

namespace App\Modules\TagManagement\Application\Services;

use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use Illuminate\Validation\ValidationException;

class GetTagDetailsService
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(int $id): array
    {
        $tag = $this->tagRepository->findById($id);

        if ($tag === null) {
            throw ValidationException::withMessages([
                'id' => ['Tag nao encontrada.'],
            ]);
        }

        $produtos = $this->tagRepository->getProductsByTagId($id);
        $totalProdutos = $this->tagRepository->countProductsByTagId($id);

        return [
            'tag' => $tag,
            'produtos' => $produtos,
            'totalProdutos' => $totalProdutos,
        ];
    }
}
