<?php

namespace App\Modules\ProductManagement\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ProductManagement\Application\DTOs\CreateProductVariationDTO;
use App\Modules\ProductManagement\Application\DTOs\UpdateProductVariationDTO;
use App\Modules\ProductManagement\Application\Services\CreateProductVariationService;
use App\Modules\ProductManagement\Application\Services\DeleteProductVariationService;
use App\Modules\ProductManagement\Application\Services\UpdateProductVariationService;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Presentation\Http\Requests\CreateProductVariationRequest;
use App\Modules\ProductManagement\Presentation\Http\Requests\UpdateProductVariationRequest;
use Illuminate\Http\RedirectResponse;

class ProductVariationController extends Controller
{
    public function __construct(
        private CreateProductVariationService $createVariationService,
        private UpdateProductVariationService $updateVariationService,
        private DeleteProductVariationService $deleteVariationService,
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function store(CreateProductVariationRequest $request, int $productId): RedirectResponse
    {
        $dto = new CreateProductVariationDTO(
            produtoId: $productId,
            active: $request->boolean('active', true),
            quantidadeEstoque: $request->integer('quantidade_estoque', 0),
            corId: $request->validated('cor_id'),
            tamanhoRoupaAdulto: $request->validated('tamanho_roupa_adulto'),
            tamanhoRoupaCrianca: $request->validated('tamanho_roupa_crianca'),
            tamanhoCalcado: $request->validated('tamanho_calcado'),
            sku: $request->validated('sku'),
            fotoIds: $request->validated('foto_ids'),
        );

        $this->createVariationService->execute($dto);

        return redirect()->route('admin.products.edit', $productId)
            ->with('success', 'Variacao criada com sucesso.');
    }

    public function update(UpdateProductVariationRequest $request, int $productId, int $id): RedirectResponse
    {
        $dto = new UpdateProductVariationDTO(
            id: $id,
            produtoId: $productId,
            active: $request->boolean('active', true),
            quantidadeEstoque: $request->integer('quantidade_estoque', 0),
            corId: $request->validated('cor_id'),
            tamanhoRoupaAdulto: $request->validated('tamanho_roupa_adulto'),
            tamanhoRoupaCrianca: $request->validated('tamanho_roupa_crianca'),
            tamanhoCalcado: $request->validated('tamanho_calcado'),
            sku: $request->validated('sku'),
            fotoIds: $request->validated('foto_ids'),
        );

        $this->updateVariationService->execute($dto);

        return redirect()->route('admin.products.edit', $productId)
            ->with('success', 'Variacao atualizada com sucesso.');
    }

    public function destroy(int $productId, int $id): RedirectResponse
    {
        $this->deleteVariationService->execute($id);

        return redirect()->route('admin.products.edit', $productId)
            ->with('success', 'Variacao excluida com sucesso.');
    }
}
