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
        Schema::create('purchase_transaction_discounts', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_transaction', 12)->nullable();
            $table->unsignedBigInteger('discount')->nullable();
            $table->timestamps();

            $table->foreign('purchase_transaction')
            ->references('id')
            ->on('purchase_transactions')
            ->nullOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('discount')
            ->references('id')
            ->on('discounts')
            ->nullOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_transaction_discounts');
    }
};
