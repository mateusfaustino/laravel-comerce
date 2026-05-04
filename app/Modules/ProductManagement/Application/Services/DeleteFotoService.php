<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DeleteFotoService
{
    public function __construct(
        private FotoRepositoryInterface $fotoRepository,
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(int $id): void
    {
        $foto = $this->fotoRepository->findById($id);

        if ($foto === null) {
            throw ValidationException::withMessages([
                'id' => ['Foto nao encontrada.'],
            ]);
        }

        // Delete file from storage
        if ($foto->getPath() && Storage::disk('public')->exists($foto->getPath())) {
            Storage::disk('public')->delete($foto->getPath());
        }

        $this->fotoRepository->delete($id);
    }
}
