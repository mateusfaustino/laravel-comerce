<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('slug', 255)->unique();
            $table->string('descricao', 255)->nullable();
            $table->decimal('preco_venda', 10, 2);
            $table->decimal('preco_promocional', 10, 2)->nullable();
            $table->decimal('custo', 10, 2)->nullable();
            $table->enum('estoque_tipo', ['INFINITO', 'LIMITADO'])->default('LIMITADO');
            $table->string('sku', 255)->nullable();
            $table->string('codigo_barras', 255)->nullable();
            $table->decimal('peso', 8, 2)->nullable();
            $table->decimal('largura', 8, 2)->nullable();
            $table->decimal('altura', 8, 2)->nullable();
            $table->decimal('comprimento', 8, 2)->nullable();
            $table->boolean('active')->default(true);
            $table->enum('tipo_produto', ['ROUPA_ADULTO', 'ROUPA_CRIANCA', 'CALCADO']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};
