<?php

namespace App\Modules\TagManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\TagManagement\Application\DTOs\CreateTagDTO;
use App\Modules\TagManagement\Application\DTOs\UpdateTagDTO;
use App\Modules\TagManagement\Application\Services\AttachTagToProductService;
use App\Modules\TagManagement\Application\Services\CreateTagService;
use App\Modules\TagManagement\Application\Services\DeleteTagService;
use App\Modules\TagManagement\Application\Services\DetachTagFromProductService;
use App\Modules\TagManagement\Application\Services\GetTagDetailsService;
use App\Modules\TagManagement\Application\Services\ListTagsService;
use App\Modules\TagManagement\Application\Services\SearchTagsService;
use App\Modules\TagManagement\Application\Services\UpdateTagService;
use App\Modules\TagManagement\Domain\Entities\Tag;
use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use App\Modules\TagManagement\Presentation\Http\Requests\CreateTagRequest;
use App\Modules\TagManagement\Presentation\Http\Requests\UpdateTagRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
        private ListTagsService $listTagsService,
        private CreateTagService $createTagService,
        private UpdateTagService $updateTagService,
        private DeleteTagService $deleteTagService,
        private GetTagDetailsService $getTagDetailsService,
        private SearchTagsService $searchTagsService,
        private AttachTagToProductService $attachTagToProductService,
        private DetachTagFromProductService $detachTagFromProductService,
    ) {}

    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $perPage = 10;
        $search = $request->input('search');
        $search = is_string($search) ? $search : null;

        $result = $this->listTagsService->execute($perPage, $page, $search);

        return Inertia::render('admin/tags/index', [
            'tags' => array_map([$this, 'toArray'], $result['tags']),
            'total' => $result['total'],
            'perPage' => $result['perPage'],
            'currentPage' => $result['currentPage'],
            'search' => $result['search'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tags/create');
    }

    public function store(CreateTagRequest $request): RedirectResponse
    {
        $dto = new CreateTagDTO(
            description: (string) $request->validated('description'),
        );

        $this->createTagService->execute($dto);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag criada com sucesso.');
    }

    public function show(int $id): Response
    {
        $details = $this->getTagDetailsService->execute($id);

        return Inertia::render('admin/tags/show', [
            'tag' => $this->toArray($details['tag']),
            'produtos' => $details['produtos'],
            'totalProdutos' => $details['totalProdutos'],
        ]);
    }

    public function edit(int $id): Response
    {
        $tag = $this->tagRepository->findById($id);

        if ($tag === null) {
            abort(404);
        }

        return Inertia::render('admin/tags/edit', [
            'tag' => $this->toArray($tag),
        ]);
    }

    public function update(UpdateTagRequest $request, int $id): RedirectResponse
    {
        $dto = new UpdateTagDTO(
            id: $id,
            description: (string) $request->validated('description'),
        );

        $this->updateTagService->execute($dto);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->deleteTagService->execute($id);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag excluida com sucesso.');
    }

    /**
     * Autocomplete endpoint used by TagPicker.
     */
    public function search(Request $request): JsonResponse
    {
        $term = (string) $request->query('q', '');
        $limit = (int) $request->query('limit', 10);
        $limit = max(1, min(50, $limit));

        $tags = $this->searchTagsService->execute($term, $limit);

        return response()->json([
            'data' => array_map([$this, 'toArray'], $tags),
        ]);
    }

    /**
     * Attach an existing tag to a product (from tag detail page).
     */
    public function attachProduct(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'product_id' => ['required', 'integer', 'exists:produtos,id'],
        ]);

        $this->attachTagToProductService->execute($id, (int) $request->input('product_id'));

        return redirect()->route('admin.tags.show', $id)
            ->with('success', 'Produto vinculado a tag com sucesso.');
    }

    /**
     * Detach a product from a tag (from tag detail page).
     */
    public function detachProduct(int $id, int $productId): RedirectResponse
    {
        $this->detachTagFromProductService->execute($id, $productId);

        return redirect()->route('admin.tags.show', $id)
            ->with('success', 'Produto desvinculado da tag.');
    }

    /**
     * Lightweight JSON product search for the attach UI.
     */
    public function searchProducts(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('q', ''));
        $limit = (int) $request->query('limit', 10);
        $limit = max(1, min(20, $limit));

        if ($term === '') {
            return response()->json(['data' => []]);
        }

        $rows = DB::table('produtos')
            ->where('active', true)
            ->where('nome', 'like', '%'.$term.'%')
            ->orderBy('nome')
            ->limit($limit)
            ->select('id', 'nome', 'slug')
            ->get();

        return response()->json([
            'data' => $rows->map(fn ($r) => [
                'id' => (int) $r->id,
                'nome' => (string) $r->nome,
                'slug' => (string) $r->slug,
            ])->all(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(Tag $tag): array
    {
        return [
            'id' => $tag->getId(),
            'description' => $tag->getDescription(),
            'createdAt' => $tag->getCreatedAt()?->toDateTimeString(),
            'updatedAt' => $tag->getUpdatedAt()?->toDateTimeString(),
        ];
    }
}
