<?php

namespace App\Modules\Authentication\Domain\Repositories;

use App\Modules\Authentication\Domain\Entities\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function findById(int $id): ?User;

    public function save(User $user): User;

    public function update(User $user): User;
}
