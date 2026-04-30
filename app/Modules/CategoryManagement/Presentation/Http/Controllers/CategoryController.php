<?php

namespace App\Modules\CategoryManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CategoryManagement\Application\DTOs\CreateCategoryDTO;
use App\Modules\CategoryManagement\Application\DTOs\UpdateCategoryDTO;
use App\Modules\CategoryManagement\Application\Services\CreateCategoryService;
use App\Modules\CategoryManagement\Application\Services\DeleteCategoryService;
use App\Modules\CategoryManagement\Application\Services\ListCategoriesService;
use App\Modules\CategoryManagement\Application\Services\UpdateCategoryService;
use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\CategoryManagement\Presentation\Http\Requests\CreateCategoryRequest;
use App\Modules\CategoryManagement\Presentation\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private ListCategoriesService $listCategoriesService,
        private CreateCategoryService $createCategoryService,
        private UpdateCategoryService $updateCategoryService,
        private DeleteCategoryService $deleteCategoryService,
    ) {}

    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $perPage = 10;

        $result = $this->listCategoriesService->execute($perPage, $page);

        return Inertia::render('admin/categories/index', [
            'categories' => array_map([$this, 'toArray'], $result['categories']),
            'total' => $result['total'],
            'perPage' => $result['perPage'],
            'currentPage' => $result['currentPage'],
        ]);
    }

    public function create(): Response
    {
        $rootCategories = $this->categoryRepository->findRootCategories(active: true);

        return Inertia::render('admin/categories/create', [
            'rootCategories' => array_map([$this, 'toArray'], $rootCategories),
        ]);
    }

    public function store(CreateCategoryRequest $request): RedirectResponse
    {
        $dto = new CreateCategoryDTO(
            name: $request->validated('name'),
            slug: $request->validated('slug'),
            parentId: $request->validated('parent_id'),
            active: $request->boolean('active', true),
        );

        $this->createCategoryService->execute($dto);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria criada com sucesso.');
    }

    public function show(int $id): Response
    {
        $category = $this->categoryRepository->findById($id);

        if ($category === null) {
            abort(404);
        }

        $children = $category->isSubcategory() ? [] : $this->categoryRepository->findChildren($id);

        return Inertia::render('admin/categories/show', [
            'category' => $this->toArray($category),
            'subcategories' => array_map([$this, 'toArray'], $children),
        ]);
    }

    public function edit(int $id): Response
    {
        $category = $this->categoryRepository->findById($id);

        if ($category === null) {
            abort(404);
        }

        $rootCategories = $this->categoryRepository->findRootCategories(active: true);
        $children = $category->isSubcategory() ? [] : $this->categoryRepository->findChildren($id);

        return Inertia::render('admin/categories/edit', [
            'category' => $this->toArray($category),
            'rootCategories' => array_map([$this, 'toArray'], $rootCategories),
            'subcategories' => array_map([$this, 'toArray'], $children),
        ]);
    }

    public function update(UpdateCategoryRequest $request, int $id): RedirectResponse
    {
        $dto = new UpdateCategoryDTO(
            id: $id,
            name: $request->validated('name'),
            slug: $request->validated('slug'),
            parentId: $request->validated('parent_id'),
            active: $request->boolean('active', true),
        );

        $this->updateCategoryService->execute($dto);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->deleteCategoryService->execute($id);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria desativada com sucesso.');
    }

    /**
     * @param \App\Modules\CategoryManagement\Domain\Entities\Category $category
     * @return array<string, mixed>
     */
    private function toArray($category): array
    {
        $parentId = $category->getParentId();
        $parentName = null;

        if ($parentId !== null) {
            $parent = $this->categoryRepository->findById($parentId);
            $parentName = $parent?->getName();
        }

        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'parentId' => $parentId,
            'parentName' => $parentName,
            'isSubcategory' => $category->isSubcategory(),
            'active' => $category->isActive(),
            'createdAt' => $category->getCreatedAt()?->toDateTimeString(),
            'updatedAt' => $category->getUpdatedAt()?->toDateTimeString(),
        ];
    }
}
