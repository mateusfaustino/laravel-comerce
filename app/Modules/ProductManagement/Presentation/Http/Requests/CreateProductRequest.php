<?php

namespace App\Modules\ProductManagement\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateProductRequest extends FormRequest
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
            'nome' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('produtos', 'slug')],
            'tipo_produto' => ['required', 'string', 'in:ROUPA_ADULTO,ROUPA_CRIANCA,CALCADO'],
            'estoque_tipo' => ['required', 'string', 'in:INFINITO,LIMITADO'],
            'descricao' => ['nullable', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255'],
            'codigo_barras' => ['nullable', 'string', 'max:255'],
            'peso' => ['nullable', 'numeric', 'min:0'],
            'largura' => ['nullable', 'numeric', 'min:0'],
            'altura' => ['nullable', 'numeric', 'min:0'],
            'comprimento' => ['nullable', 'numeric', 'min:0'],
            'active' => ['boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'variations' => ['nullable', 'array'],
            'variations.*.cor_id' => ['nullable', 'integer', 'exists:cores,id'],
            'variations.*.tamanho_roupa_adulto' => ['nullable', 'string', 'in:PP,P,M,G,GG,XG'],
            'variations.*.tamanho_roupa_crianca' => ['nullable', 'string', 'in:2,4,6,8,10,12,14'],
            'variations.*.tamanho_calcado' => ['nullable', 'string', 'in:32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48'],
            'variations.*.quantidade_estoque' => ['integer', 'min:0'],
            'variations.*.sku' => ['nullable', 'string', 'max:255'],
            'variations.*.preco_venda' => ['required', 'numeric', 'min:0'],
            'variations.*.preco_promocional' => ['nullable', 'numeric', 'min:0'],
            'variations.*.custo' => ['nullable', 'numeric', 'min:0'],
            'variations.*.active' => ['boolean'],
        ];
    }
}
