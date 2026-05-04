<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produto_variacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produto_id')->constrained('produtos')->cascadeOnDelete();
            $table->foreignId('cor_id')->nullable()->constrained('cores')->nullOnDelete();
            $table->enum('tamanho_roupa_adulto', ['PP', 'P', 'M', 'G', 'GG', 'XG'])->nullable();
            $table->enum('tamanho_roupa_crianca', ['2', '4', '6', '8', '10', '12', '14'])->nullable();
            $table->enum('tamanho_calcado', ['32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'])->nullable();
            $table->boolean('active')->default(true);
            $table->integer('quantidade_estoque')->default(0);
            $table->string('sku', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produto_variacoes');
    }
};
