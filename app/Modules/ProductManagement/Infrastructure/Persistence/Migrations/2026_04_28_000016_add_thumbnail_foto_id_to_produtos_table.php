<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->foreignId('thumbnail_foto_id')
                ->nullable()
                ->after('tipo_produto')
                ->constrained('fotos')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropForeign(['thumbnail_foto_id']);
            $table->dropColumn('thumbnail_foto_id');
        });
    }
};
