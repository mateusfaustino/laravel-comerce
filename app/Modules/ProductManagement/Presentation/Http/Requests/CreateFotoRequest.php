<?php

namespace App\Modules\ProductManagement\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateFotoRequest extends FormRequest
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
            'foto' => ['required', 'image', 'max:5120'],
            'product_id' => ['required', 'integer', 'exists:produtos,id'],
            'descricao' => ['nullable', 'string', 'max:255'],
            'ordem' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
