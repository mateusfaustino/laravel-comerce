<?php

namespace App\Modules\Authentication\Application\Services;

use App\Modules\Authentication\Application\DTOs\RegisterDTO;
use App\Modules\Authentication\Domain\Entities\User;
use App\Modules\Authentication\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    /**
     * Register a new user.
     *
     * @throws ValidationException
     */
    public function execute(RegisterDTO $dto): User
    {
        $this->validate($dto);

        $user = new User(
            name: $dto->name,
            email: $dto->email,
            password: Hash::make($dto->password),
        );

        return $this->userRepository->save($user);
    }

    /**
     * Validate registration data.
     *
     * @throws ValidationException
     */
    private function validate(RegisterDTO $dto): void
    {
        $existingUser = $this->userRepository->findByEmail($dto->email);

        if ($existingUser !== null) {
            throw ValidationException::withMessages([
                'email' => ['The email has already been taken.'],
            ]);
        }
    }
}
