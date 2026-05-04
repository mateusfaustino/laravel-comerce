<?php

namespace App\Modules\ProductManagement\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCorRequest extends FormRequest
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
            'cod_rgb' => ['required', 'string', 'size:6', 'regex:/^[0-9A-Fa-f]{6}$/'],
        ];
    }
}
