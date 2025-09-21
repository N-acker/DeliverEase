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
        Schema::create('menu_items', function (Blueprint $table) {
             $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade'); //would be used in a case if every restaurant had a different menu
            $table->string('name');
            $table->integer('price'); // in cents (e.g., 1099 = $10.99)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
