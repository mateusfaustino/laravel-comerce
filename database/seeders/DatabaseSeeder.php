<?php

namespace Database\Seeders;

use App\Modules\Authentication\Infrastructure\Seeders\AuthenticationSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AuthenticationSeeder::class,
        ]);
    }
}
