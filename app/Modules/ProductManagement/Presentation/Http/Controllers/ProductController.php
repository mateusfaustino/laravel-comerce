<?php

namespace App\Modules\ProductManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\ProductManagement\Application\DTOs\CreateFotoDTO;
use App\Modules\ProductManagement\Application\DTOs\CreateProductDTO;
use App\Modules\ProductManagement\Application\DTOs\UpdateProductDTO;
use App\Modules\ProductManagement\Application\Services\ActivateProductService;
use App\Modules\ProductManagement\Application\Services\CreateFotoService;
use App\Modules\ProductManagement\Application\Services\CreateProductService;
use App\Modules\ProductManagement\Application\Services\DeleteProductService;
use App\Modules\ProductManagement\Application\Services\ListProductsService;
use App\Modules\ProductManagement\Application\Services\ListProductVariationsService;
use App\Modules\ProductManagement\Application\Services\UpdateProductService;
use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\ProductManagement\Presentation\Http\Requests\CreateProductRequest;
use App\Modules\ProductManagement\Presentation\Http\Requests\UpdateProductRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private CorRepositoryInterface $corRepository,
        private FotoRepositoryInterface $fotoRepository,
        private ProductVariationRepositoryInterface $variationRepository,
        private CreateFotoService $createFotoService,
        private ListProductsService $listProductsService,
        private ListProductVariationsService $listProductVariationsService,
        private CreateProductService $createProductService,
        private UpdateProductService $updateProductService,
        private DeleteProductService $deleteProductService,
        private ActivateProductService $activateProductService,
    ) {}

    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);
        $perPage = 10;

        $activeResult = $this->listProductsService->execute($perPage, $page, active: true);
        $inactiveProducts = $this->productRepository->findInactive();

        return Inertia::render('admin/products/index', [
            'products' => array_map([$this, 'toArray'], $activeResult['products']),
            'total' => $activeResult['total'],
            'perPage' => $activeResult['perPage'],
            'currentPage' => $activeResult['currentPage'],
            'inactiveProducts' => array_map([$this, 'toArray'], $inactiveProducts),
        ]);
    }

    public function variations(Request $request, int $id): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $perPage = 5;

        $result = $this->listProductVariationsService->execute($id, $perPage, $page);

        return response()->json([
            'variations' => array_map([$this, 'variationToArray'], $result['variations']),
            'total' => $result['total'],
            'perPage' => $result['perPage'],
            'currentPage' => $result['currentPage'],
        ]);
    }

    public function create(): Response
    {
        $categories = $this->categoryRepository->findRootCategories(active: true);
        $subcategories = [];
        foreach ($categories as $cat) {
            $children = $this->categoryRepository->findChildren($cat->getId());
            foreach ($children as $child) {
                $subcategories[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'parentId' => $cat->getId(),
                    'parentName' => $cat->getName(),
                ];
            }
        }

        $cores = $this->corRepository->findAll();

        return Inertia::render('admin/products/create', [
            'categories' => array_map(fn ($c) => ['id' => $c->getId(), 'name' => $c->getName()], $categories),
            'subcategories' => $subcategories,
            'cores' => array_map(fn ($c) => ['id' => $c->getId(), 'nome' => $c->getNome(), 'codRgb' => $c->getCodRgb()], $cores),
        ]);
    }

    public function store(CreateProductRequest $request): RedirectResponse
    {
        $dto = new CreateProductDTO(
            nome: $request->validated('nome'),
            slug: $request->validated('slug'),
            tipoProduto: $request->validated('tipo_produto'),
            estoqueTipo: $request->validated('estoque_tipo'),
            descricao: $request->validated('descricao'),
            sku: $request->validated('sku'),
            codigoBarras: $request->validated('codigo_barras'),
            peso: $request->validated('peso'),
            largura: $request->validated('largura'),
            altura: $request->validated('altura'),
            comprimento: $request->validated('comprimento'),
            active: $request->boolean('active', true),
            categoryIds: $request->validated('category_ids'),
            variations: $request->validated('variations'),
        );

        $product = $this->createProductService->execute($dto);

        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('products', 'public');
                $fotoDto = new CreateFotoDTO(
                    path: $path,
                    productId: (int) $product->getId(),
                    descricao: null,
                    ordem: 0,
                );
                $this->createFotoService->execute($fotoDto);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto criado com sucesso.');
    }

    public function show(int $id): Response
    {
        $product = $this->productRepository->findById($id);

        if ($product === null) {
            abort(404);
        }

        $fotos = $this->fotoRepository->findByProductId($id);
        $variations = $this->variationRepository->findByProductId($id);

        return Inertia::render('admin/products/show', [
            'product' => $this->toArray($product),
            'fotos' => array_map([$this, 'fotoToArray'], $fotos),
            'variations' => array_map([$this, 'variationToArray'], $variations),
        ]);
    }

    public function edit(int $id): Response
    {
        $product = $this->productRepository->findById($id);

        if ($product === null) {
            abort(404);
        }

        $categories = $this->categoryRepository->findRootCategories(active: true);
        $subcategories = [];
        foreach ($categories as $cat) {
            $children = $this->categoryRepository->findChildren($cat->getId());
            foreach ($children as $child) {
                $subcategories[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'parentId' => $cat->getId(),
                    'parentName' => $cat->getName(),
                ];
            }
        }

        $fotos = $this->fotoRepository->findByProductId($id);
        $variations = $this->variationRepository->findByProductId($id);
        $cores = $this->corRepository->findAll();
        $selectedCategoryIds = $this->productRepository->getCategoryIds($id);

        return Inertia::render('admin/products/edit', [
            'product' => $this->toArray($product),
            'categories' => array_map(fn ($c) => ['id' => $c->getId(), 'name' => $c->getName()], $categories),
            'subcategories' => $subcategories,
            'fotos' => array_map([$this, 'fotoToArray'], $fotos),
            'variations' => array_map([$this, 'variationToArray'], $variations),
            'cores' => array_map(fn ($c) => ['id' => $c->getId(), 'nome' => $c->getNome(), 'codRgb' => $c->getCodRgb()], $cores),
            'selectedCategoryIds' => $selectedCategoryIds,
        ]);
    }

    public function update(UpdateProductRequest $request, int $id): RedirectResponse
    {
        $dto = new UpdateProductDTO(
            id: $id,
            nome: $request->validated('nome'),
            slug: $request->validated('slug'),
            tipoProduto: $request->validated('tipo_produto'),
            estoqueTipo: $request->validated('estoque_tipo'),
            descricao: $request->validated('descricao'),
            sku: $request->validated('sku'),
            codigoBarras: $request->validated('codigo_barras'),
            peso: $request->validated('peso'),
            largura: $request->validated('largura'),
            altura: $request->validated('altura'),
            comprimento: $request->validated('comprimento'),
            active: $request->boolean('active', true),
            categoryIds: $request->validated('category_ids'),
            thumbnailFotoId: $request->validated('thumbnail_foto_id'),
        );

        $this->updateProductService->execute($dto);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->deleteProductService->execute($id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto desativado com sucesso.');
    }

    public function forceDestroy(int $id): RedirectResponse
    {
        $this->productRepository->permanentlyDelete($id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto excluido permanentemente.');
    }

    public function activate(int $id): RedirectResponse
    {
        $this->activateProductService->execute($id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto reativado com sucesso.');
    }

    private function toArray($product): array
    {
        return [
            'id' => $product->getId(),
            'nome' => $product->getNome(),
            'slug' => $product->getSlug(),
            'tipoProduto' => $product->getTipoProduto(),
            'estoqueTipo' => $product->getEstoqueTipo(),
            'descricao' => $product->getDescricao(),
            'sku' => $product->getSku(),
            'codigoBarras' => $product->getCodigoBarras(),
            'peso' => $product->getPeso(),
            'largura' => $product->getLargura(),
            'altura' => $product->getAltura(),
            'comprimento' => $product->getComprimento(),
            'active' => $product->isActive(),
            'thumbnailFotoId' => $product->getThumbnailFotoId(),
            'variacoesCount' => $product->getVariacoesCount(),
            'categoryIds' => $product->getCategoryIds(),
            'categoryNames' => $product->getCategoryNames(),
            'createdAt' => $product->getCreatedAt()?->toDateTimeString(),
            'updatedAt' => $product->getUpdatedAt()?->toDateTimeString(),
        ];
    }

    private function variationToArray($variation): array
    {
        return [
            'id' => $variation->getId(),
            'produtoId' => $variation->getProdutoId(),
            'corId' => $variation->getCorId(),
            'corNome' => $variation->getCorNome(),
            'corCodRgb' => $variation->getCorCodRgb(),
            'tamanhoRoupaAdulto' => $variation->getTamanhoRoupaAdulto(),
            'tamanhoRoupaCrianca' => $variation->getTamanhoRoupaCrianca(),
            'tamanhoCalcado' => $variation->getTamanhoCalcado(),
            'active' => $variation->isActive(),
            'quantidadeEstoque' => $variation->getQuantidadeEstoque(),
            'sku' => $variation->getSku(),
            'precoVenda' => $variation->getPrecoVenda(),
            'precoPromocional' => $variation->getPrecoPromocional(),
            'custo' => $variation->getCusto(),
            'fotoIds' => $variation->getFotoIds(),
        ];
    }

    private function fotoToArray($foto): array
    {
        return [
            'id' => $foto->getId(),
            'path' => $foto->getPath(),
            'url' => Storage::disk('public')->url($foto->getPath()),
            'productId' => $foto->getProductId(),
            'descricao' => $foto->getDescricao(),
            'ordem' => $foto->getOrdem(),
        ];
    }
}
