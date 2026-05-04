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
            'preco_venda' => ['required', 'numeric', 'min:0'],
            'preco_promocional' => ['nullable', 'numeric', 'min:0'],
            'custo' => ['nullable', 'numeric', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255'],
            'codigo_barras' => ['nullable', 'string', 'max:255'],
            'peso' => ['nullable', 'numeric', 'min:0'],
            'largura' => ['nullable', 'numeric', 'min:0'],
            'altura' => ['nullable', 'numeric', 'min:0'],
            'comprimento' => ['nullable', 'numeric', 'min:0'],
            'active' => ['boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
        ];
    }
}
