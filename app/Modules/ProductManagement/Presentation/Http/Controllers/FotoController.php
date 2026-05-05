<?php

namespace App\Modules\ProductManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ProductManagement\Application\DTOs\CreateFotoDTO;
use App\Modules\ProductManagement\Application\Services\CreateFotoService;
use App\Modules\ProductManagement\Application\Services\DeleteFotoService;
use App\Modules\ProductManagement\Application\Services\UpdateFotoService;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Presentation\Http\Requests\CreateFotoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FotoController extends Controller
{
    public function __construct(
        private FotoRepositoryInterface $fotoRepository,
        private ProductRepositoryInterface $productRepository,
        private CreateFotoService $createFotoService,
        private UpdateFotoService $updateFotoService,
        private DeleteFotoService $deleteFotoService,
    ) {}

    public function index(Request $request): Response
    {
        $products = $this->productRepository->findAll(active: true);

        return Inertia::render('admin/fotos/index', [
            'products' => array_map(fn ($p) => ['id' => $p->getId(), 'nome' => $p->getNome()], $products),
        ]);
    }

    public function byProduct(int $productId): JsonResponse
    {
        $fotos = $this->fotoRepository->findByProductId($productId);

        return response()->json([
            'fotos' => array_map([$this, 'fotoToArray'], $fotos),
        ]);
    }

    public function create(): Response
    {
        $products = $this->productRepository->findAll(active: true);

        return Inertia::render('admin/fotos/create', [
            'products' => array_map(fn ($p) => ['id' => $p->getId(), 'nome' => $p->getNome()], $products),
        ]);
    }

    public function store(CreateFotoRequest $request): RedirectResponse
    {
        $file = $request->file('foto');
        $path = $file->store('products', 'public');

        $dto = new CreateFotoDTO(
            path: $path,
            productId: (int) $request->validated('product_id'),
            descricao: $request->validated('descricao'),
            ordem: $request->integer('ordem', 0),
        );

        $this->createFotoService->execute($dto);

        return redirect()->route('admin.fotos.index')
            ->with('success', 'Foto enviada com sucesso.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $foto = $this->fotoRepository->findById($id);

        if ($foto === null) {
            abort(404);
        }

        $this->updateFotoService->execute(
            $id,
            $request->input('descricao'),
            $request->integer('ordem'),
        );

        return redirect()->back()
            ->with('success', 'Foto atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->deleteFotoService->execute($id);

        return redirect()->back()
            ->with('success', 'Foto excluida com sucesso.');
    }

    private function fotoToArray($foto): array
    {
        return [
            'id' => $foto->getId(),
            'path' => $foto->getPath(),
            'productId' => $foto->getProductId(),
            'descricao' => $foto->getDescricao(),
            'ordem' => $foto->getOrdem(),
        ];
    }
}
