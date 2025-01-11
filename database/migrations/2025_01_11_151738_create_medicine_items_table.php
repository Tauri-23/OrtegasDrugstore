<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medicine_items', function (Blueprint $table) {
            $table->string('id', 8)->primary();
            $table->string('medicine')->nullable();
            $table->date('expiration_date');
            $table->timestamps();

            $table->foreign('medicine')
            ->references('id')
            ->on('medicines')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_items');
    }
};
