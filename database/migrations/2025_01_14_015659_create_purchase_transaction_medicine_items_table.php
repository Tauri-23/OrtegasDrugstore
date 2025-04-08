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
        Schema::create('purchase_transaction_medicine_items', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('purchase_transaction_item')->nullable();
            
            $table->string('medicine_item_id', 8)->nullable();
            $table->integer("qty_purchased");
            $table->string('medicine')->nullable();       

            $table->timestamps();

            $table->foreign('medicine_item_id')
            ->references('id')
            ->on('medicine_items')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('medicine')
            ->references('id')
            ->on('medicines')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('purchase_transaction_item', 'fk_purchase_item')
            ->references('id')
            ->on('purchase_transaction_items')
            ->cascadeOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_transaction_medicine_items');
    }
};
