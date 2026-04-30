<?php

namespace App\Modules\CategoryManagement\Infrastructure\Commands;

use App\Modules\CategoryManagement\Infrastructure\Persistence\Models\EloquentCategoryModel;
use Illuminate\Console\Command;

class SyncDefaultCategoriesCommand extends Command
{
    protected $signature = 'category:sync-defaults';

    protected $description = 'Synchronize default categories from config file to the database';

    public function handle(): int
    {
        $config = require __DIR__.'/../Config/DefaultCategories.php';

        if (empty($config)) {
            $this->error('No default categories configuration found.');

            return self::FAILURE;
        }

        foreach ($config as $key => $categoryData) {
            $rootCategory = EloquentCategoryModel::firstOrCreate(
                [
                    'slug' => $categoryData['slug'],
                    'parent_id' => null,
                ],
                [
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug'],
                    'parent_id' => null,
                    'active' => true,
                ]
            );

            if (! $rootCategory->wasRecentlyCreated) {
                $rootCategory->update([
                    'name' => $categoryData['name'],
                    'active' => true,
                ]);
                $this->info("Updated category: {$categoryData['name']}");
            } else {
                $this->info("Created category: {$categoryData['name']}");
            }

            if (! empty($categoryData['subcategories'])) {
                foreach ($categoryData['subcategories'] as $subKey => $subData) {
                    $subcategory = EloquentCategoryModel::firstOrCreate(
                        [
                            'slug' => $subData['slug'],
                            'parent_id' => $rootCategory->id,
                        ],
                        [
                            'name' => $subData['name'],
                            'slug' => $subData['slug'],
                            'parent_id' => $rootCategory->id,
                            'active' => true,
                        ]
                    );

                    if (! $subcategory->wasRecentlyCreated) {
                        $subcategory->update([
                            'name' => $subData['name'],
                            'active' => true,
                        ]);
                        $this->info("  Updated subcategory: {$subData['name']}");
                    } else {
                        $this->info("  Created subcategory: {$subData['name']}");
                    }
                }
            }
        }

        $this->info('Default categories synchronized successfully.');

        return self::SUCCESS;
    }
}
