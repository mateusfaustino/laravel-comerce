<?php

namespace App\Modules\Authentication\Application\Services;

use App\Modules\Authentication\Application\DTOs\LoginDTO;
use App\Modules\Authentication\Domain\Entities\User;
use App\Modules\Authentication\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class LoginUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    /**
     * Attempt to authenticate a user with the given credentials.
     *
     * Returns the domain User entity on success, or null on failure.
     */
    public function execute(LoginDTO $dto): ?User
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if ($user === null) {
            return null;
        }

        if (! Hash::check($dto->password, $user->getPassword())) {
            return null;
        }

        return $user;
    }
}
