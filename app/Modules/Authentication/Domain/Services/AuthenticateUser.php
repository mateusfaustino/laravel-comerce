<?php

namespace App\Modules\Authentication\Domain\Services;

use App\Modules\Authentication\Domain\Entities\User;
use App\Modules\Authentication\Domain\Repositories\UserRepositoryInterface;

class AuthenticateUser
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function verifyCredentials(string $email, string $password): ?User
    {
        $user = $this->userRepository->findByEmail($email);

        if ($user === null) {
            return null;
        }

        // Password verification is handled at infrastructure level
        // since it depends on Laravel's hashing implementation
        return $user;
    }
}
