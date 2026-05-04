<?php

namespace App\Modules\ProductManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ProductManagement\Application\DTOs\CreateCorDTO;
use App\Modules\ProductManagement\Application\DTOs\UpdateCorDTO;
use App\Modules\ProductManagement\Application\Services\CreateCorService;
use App\Modules\ProductManagement\Application\Services\DeleteCorService;
use App\Modules\ProductManagement\Application\Services\ListCoresService;
use App\Modules\ProductManagement\Application\Services\UpdateCorService;
use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use App\Modules\ProductManagement\Presentation\Http\Requests\CreateCorRequest;
use App\Modules\ProductManagement\Presentation\Http\Requests\UpdateCorRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CorController extends Controller
{
    public function __construct(
        private CorRepositoryInterface $corRepository,
        private ListCoresService $listCoresService,
        private CreateCorService $createCorService,
        private UpdateCorService $updateCorService,
        private DeleteCorService $deleteCorService,
    ) {}

    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $perPage = 10;

        $result = $this->listCoresService->execute($perPage, $page);

        return Inertia::render('admin/cores/index', [
            'cores' => array_map([$this, 'toArray'], $result['cores']),
            'total' => $result['total'],
            'perPage' => $result['perPage'],
            'currentPage' => $result['currentPage'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/cores/create');
    }

    public function store(CreateCorRequest $request): RedirectResponse
    {
        $dto = new CreateCorDTO(
            nome: $request->validated('nome'),
            codRgb: $request->validated('cod_rgb'),
        );

        $this->createCorService->execute($dto);

        return redirect()->route('admin.cores.index')
            ->with('success', 'Cor criada com sucesso.');
    }

    public function edit(int $id): Response
    {
        $cor = $this->corRepository->findById($id);

        if ($cor === null) {
            abort(404);
        }

        return Inertia::render('admin/cores/edit', [
            'cor' => $this->toArray($cor),
        ]);
    }

    public function update(UpdateCorRequest $request, int $id): RedirectResponse
    {
        $dto = new UpdateCorDTO(
            id: $id,
            nome: $request->validated('nome'),
            codRgb: $request->validated('cod_rgb'),
        );

        $this->updateCorService->execute($dto);

        return redirect()->route('admin.cores.index')
            ->with('success', 'Cor atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->deleteCorService->execute($id);

        return redirect()->route('admin.cores.index')
            ->with('success', 'Cor excluida com sucesso.');
    }

    private function toArray($cor): array
    {
        return [
            'id' => $cor->getId(),
            'nome' => $cor->getNome(),
            'codRgb' => $cor->getCodRgb(),
            'createdAt' => $cor->getCreatedAt()?->toDateTimeString(),
            'updatedAt' => $cor->getUpdatedAt()?->toDateTimeString(),
        ];
    }
}
