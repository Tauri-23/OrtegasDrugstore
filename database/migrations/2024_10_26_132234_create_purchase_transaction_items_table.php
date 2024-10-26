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
        Schema::create('purchase_transaction_items', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_transaction', 12)->nullable(); // Foreign
            $table->string("medicine", 12)->nullable(); // Foreign
            $table->integer('qty');
            $table->timestamps();

            $table->foreign('purchase_transaction')
            ->references('id')
            ->on('purchase_transactions')
            ->nullOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('medicine')
            ->references('id')
            ->on('medicines')
            ->nullOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_transaction_items');
    }
};
