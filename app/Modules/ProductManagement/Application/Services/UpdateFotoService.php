<?php

namespace App\Modules\ProductManagement\Application\Services;

use App\Modules\ProductManagement\Domain\Entities\Foto;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use Illuminate\Validation\ValidationException;

class UpdateFotoService
{
    public function __construct(
        private FotoRepositoryInterface $fotoRepository,
    ) {}

    public function execute(int $id, ?string $descricao = null, ?int $ordem = null): Foto
    {
        $foto = $this->fotoRepository->findById($id);

        if ($foto === null) {
            throw ValidationException::withMessages([
                'id' => ['Foto nao encontrada.'],
            ]);
        }

        if ($descricao !== null) {
            $foto->setDescricao($descricao);
        }

        if ($ordem !== null) {
            $foto->setOrdem($ordem);
        }

        return $this->fotoRepository->update($foto);
    }
}
