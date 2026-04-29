<?php

namespace App\Actions\Fortify;

use App\Modules\Authentication\Application\DTOs\RegisterDTO;
use App\Modules\Authentication\Application\UseCases\RegisterUseCase;
use App\Modules\Authentication\Infrastructure\Models\EloquentUserModel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    public function __construct(
        private RegisterUseCase $registerUseCase,
    ) {}

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): EloquentUserModel
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ])->validate();

        $dto = new RegisterDTO(
            name: $input['name'],
            email: $input['email'],
            password: $input['password'],
        );

        $domainUser = $this->registerUseCase->execute($dto);

        // Return the Eloquent model for Fortify compatibility
        return EloquentUserModel::findOrFail($domainUser->getId());
    }
}
