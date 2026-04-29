<?php

namespace App\Modules\Authentication\Application\DTOs;

readonly class RegisterDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}
}
