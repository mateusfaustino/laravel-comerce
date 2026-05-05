<?php

namespace App\Modules\ProductManagement\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'cor_id' => ['nullable', 'integer', 'exists:cores,id'],
            'tamanho_roupa_adulto' => ['nullable', 'string', 'in:PP,P,M,G,GG,XG'],
            'tamanho_roupa_crianca' => ['nullable', 'string', 'in:2,4,6,8,10,12,14'],
            'tamanho_calcado' => ['nullable', 'string', 'in:32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48'],
            'quantidade_estoque' => ['integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255'],
            'preco_venda' => ['required', 'numeric', 'min:0'],
            'preco_promocional' => ['nullable', 'numeric', 'min:0'],
            'custo' => ['nullable', 'numeric', 'min:0'],
            'active' => ['boolean'],
            'foto_ids' => ['nullable', 'array'],
            'foto_ids.*' => ['integer', 'exists:fotos,id'],
        ];
    }
}
