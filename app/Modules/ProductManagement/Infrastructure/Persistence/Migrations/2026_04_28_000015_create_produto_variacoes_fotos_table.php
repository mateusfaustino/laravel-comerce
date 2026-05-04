<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produto_variacoes_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produto_variacao_id')->constrained('produto_variacoes')->cascadeOnDelete();
            $table->foreignId('foto_id')->constrained('fotos')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produto_variacoes_fotos');
    }
};
