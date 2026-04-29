<?php

namespace App\Modules\Authentication\Application\DTOs;

readonly class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public bool $remember = false,
    ) {}
}
