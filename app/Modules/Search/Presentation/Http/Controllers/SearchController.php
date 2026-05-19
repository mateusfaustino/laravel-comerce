<?php

namespace App\Modules\Search\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Search\Application\Services\GetTagProductsService;
use App\Modules\Search\Application\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(
        private SearchService $searchService,
        private GetTagProductsService $getTagProductsService,
    ) {}

    /**
     * Live search (JSON) for the storefront search bar.
     */
    public function live(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $term = (string) ($validated['q'] ?? '');
        $limit = (int) ($validated['limit'] ?? 5);

        $data = $this->searchService->execute($term, $limit);

        return response()->json($data);
    }

    /**
     * Storefront tag landing page (Inertia).
     */
    public function tag(string $slug): Response
    {
        $data = $this->getTagProductsService->execute($slug);

        if ($data === null) {
            abort(404);
        }

        return inertia('tag-page', [
            'tag' => $data['tag'],
            'products' => $data['products'],
        ]);
    }
}
