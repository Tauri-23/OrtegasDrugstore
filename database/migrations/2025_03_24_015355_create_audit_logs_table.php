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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Inventory
            $table->enum('inventory_activity', [
                "Added a new medicine", 
                "Added a new medicine group", 
                "Added medicine stock",

                "Configured a medicine price",
                "Configured a medicine photo",             
            ])->nullable();
            $table->string("inventory_item_id")->nullable();
            $table->float("old_medicine_price")->nullable();
            $table->float("new_medicine_price")->nullable();
            $table->integer("added_qty")->nullable();

            // Sale
            $table->enum('sale_activity', ["Sale for", "Viod for"])->nullable();
            $table->string('transaction', 12)->nullable();

            // Discount Type
            $table->enum('settings_activity', ["Added a new discount", "Configure a discount"])->nullable();
            $table->unsignedBigInteger("discount")->nullable();
            $table->float("old_discount_rate")->nullable();
            $table->float("new_discount_rate")->nullable();

            // User who did 
            $table->string("cashier", 6)->nullable(); // For Sale
            $table->string("admin", 6)->nullable(); // For Inventory and Settings

            $table->enum('type', ["Inventory", "Sale", "Settings"]);

            $table->timestamps();

            $table->foreign('transaction')
            ->references('id')
            ->on('purchase_transactions')
            ->nullOnDelete()
            ->cascadeOnUpdate();
            
            $table->foreign('discount')
            ->references('id')
            ->on('discounts')
            ->nullOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('cashier')
            ->references('id')
            ->on('user_cashiers')
            ->nullOnDelete()
            ->cascadeOnUpdate();
            
            $table->foreign('admin')
            ->references('id')
            ->on('user_admins')
            ->nullOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
