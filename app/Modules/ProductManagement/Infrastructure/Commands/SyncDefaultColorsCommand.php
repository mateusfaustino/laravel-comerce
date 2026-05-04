<?php

namespace App\Modules\ProductManagement\Infrastructure\Commands;

use App\Modules\ProductManagement\Infrastructure\Persistence\Models\EloquentCorModel;
use Illuminate\Console\Command;

class SyncDefaultColorsCommand extends Command
{
    protected $signature = 'product:sync-default-colors';

    protected $description = 'Synchronize default colors from config file to the database';

    public function handle(): int
    {
        $config = require __DIR__.'/../Config/Colors.php';

        if (empty($config)) {
            $this->error('No default colors configuration found.');

            return self::FAILURE;
        }

        foreach ($config as $key => $colorData) {
            $color = EloquentCorModel::firstOrCreate(
                [
                    'nome' => $colorData['name'],
                ],
                [
                    'nome' => $colorData['name'],
                    'cod_rgb' => $colorData['cod_rgb'],
                ]
            );

            if (! $color->wasRecentlyCreated) {
                $color->update([
                    'cod_rgb' => $colorData['cod_rgb'],
                ]);
                $this->info("Updated color: {$colorData['name']}");
            } else {
                $this->info("Created color: {$colorData['name']}");
            }
        }

        $this->info('Default colors synchronized successfully.');

        return self::SUCCESS;
    }
}
