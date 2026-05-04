<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;

class ListCoresService
{
    public function __construct(
        private CorRepositoryInterface $corRepository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(int $perPage, int $page): array
    {
        $cores = $this->corRepository->findPaginated($perPage, $page);
        $total = $this->corRepository->count();

        return [
            'cores' => $cores,
            'total' => $total,
            'perPage' => $perPage,
            'currentPage' => $page,
        ];
    }
}
