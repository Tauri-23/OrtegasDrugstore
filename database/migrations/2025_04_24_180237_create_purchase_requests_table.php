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
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->string("medicine", 12)->nullable();
            $table->integer("qty");
            $table->string("supplier_name");
            $table->string("supplier_address");
            $table->string("supplier_contact_number");
            $table->string("supplier_contact_person");
            $table->string("requested_by", 6)->nullable();
            $table->timestamps();

            $table->foreign('medicine')
            ->references("id")
            ->on("medicines")
            ->nullOnDelete()
            ->cascadeOnUpdate();

            $table->foreign('requested_by')
            ->references("id")
            ->on("user_admins")
            ->nullOnDelete()
            ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
