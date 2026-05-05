<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Add price columns to produto_variacoes
        Schema::table('produto_variacoes', function (Blueprint $table) {
            $table->decimal('preco_venda', 10, 2)->default(0)->after('sku');
            $table->decimal('preco_promocional', 10, 2)->nullable()->after('preco_venda');
            $table->decimal('custo', 10, 2)->nullable()->after('preco_promocional');
        });

        // Step 2: Migrate existing data — copy product prices to each variation
        $variations = DB::table('produto_variacoes')->get();
        foreach ($variations as $variation) {
            $product = DB::table('produtos')->where('id', $variation->produto_id)->first();
            if ($product) {
                DB::table('produto_variacoes')
                    ->where('id', $variation->id)
                    ->update([
                        'preco_venda' => $product->preco_venda ?? 0,
                        'preco_promocional' => $product->preco_promocional,
                        'custo' => $product->custo,
                    ]);
            }
        }

        // Step 3: Make preco_venda not nullable after data migration (remove default)
        Schema::table('produto_variacoes', function (Blueprint $table) {
            $table->decimal('preco_venda', 10, 2)->default(null)->change();
        });

        // Step 4: Drop price columns from produtos
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn(['preco_venda', 'preco_promocional', 'custo']);
        });
    }

    public function down(): void
    {
        // Step 1: Re-add price columns to produtos
        Schema::table('produtos', function (Blueprint $table) {
            $table->decimal('preco_venda', 10, 2)->after('descricao');
            $table->decimal('preco_promocional', 10, 2)->nullable()->after('preco_venda');
            $table->decimal('custo', 10, 2)->nullable()->after('preco_promocional');
        });

        // Step 2: Migrate data back — use first variation's prices for the product
        $products = DB::table('produtos')->get();
        foreach ($products as $product) {
            $variation = DB::table('produto_variacoes')
                ->where('produto_id', $product->id)
                ->first();
            if ($variation) {
                DB::table('produtos')
                    ->where('id', $product->id)
                    ->update([
                        'preco_venda' => $variation->preco_venda ?? 0,
                        'preco_promocional' => $variation->preco_promocional,
                        'custo' => $variation->custo,
                    ]);
            } else {
                DB::table('produtos')
                    ->where('id', $product->id)
                    ->update([
                        'preco_venda' => 0,
                    ]);
            }
        }

        // Step 3: Drop price columns from produto_variacoes
        Schema::table('produto_variacoes', function (Blueprint $table) {
            $table->dropColumn(['preco_venda', 'preco_promocional', 'custo']);
        });
    }
};
