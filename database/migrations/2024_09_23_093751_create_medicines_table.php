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
        Schema::create('medicines', function (Blueprint $table) {
            $table->string("id", 12)->primary();
            $table->string("name");
            $table->text('pic')->nullable();
            $table->string("group", 6)->nullable();
            $table->enum("type", ["Generic", "Branded"])->default("Generic");
            $table->integer("qty")->default(0);
            $table->float('price')->default(0);
            $table->boolean('prescription')->default(false);
            $table->boolean('discountable')->default(true);
            $table->float('competitor_price')->default(0);
            $table->timestamps();

            /**
             * Foreign Keys
             */
            $table->foreign('group')
                ->references('id')
                ->on('medicine_groups')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
