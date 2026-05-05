<?php

namespace App\Modules\Storefront\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Storefront\Application\Services\GetStorefrontProductService;
use App\Modules\Storefront\Application\Services\ListStorefrontHomeService;
use Illuminate\Http\Request;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function __construct(
        private ListStorefrontHomeService $listStorefrontHomeService,
        private GetStorefrontProductService $getStorefrontProductService,
    ) {}

    public function home(Request $request): Response
    {
        $data = $this->listStorefrontHomeService->execute();

        return inertia('store-homepage', [
            'categories' => $data['categories'],
            'featuredProducts' => $data['featuredProducts'],
            'newProducts' => $data['newProducts'],
            'categoryProducts' => $data['categoryProducts'],
        ]);
    }

    public function show(string $slug): Response
    {
        $data = $this->getStorefrontProductService->execute($slug);

        if ($data === null) {
            abort(404);
        }

        return inertia('product-page', [
            'product' => $data['product'],
            'similarProducts' => $data['similarProducts'],
        ]);
    }
}
