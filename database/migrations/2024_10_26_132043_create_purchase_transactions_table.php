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
        Schema::create('purchase_transactions', function (Blueprint $table) {
            $table->string('id', 12)->primary();
            $table->float('subtotal');
            $table->float('discount_deduction');
            $table->float('total');
            $table->float('cash');
            $table->float('change');
            $table->unsignedBigInteger('customer')->nullable(); // Foreign
            $table->boolean('is_void')->default(false);
            $table->timestamps();

            $table->foreign('customer')
            ->references('id')
            ->on('purchase_transaction_customers')
            ->nullOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_transactions');
    }
};
