<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('street', 255)->nullable();
            $table->string('exterior_number', 50)->nullable();
            $table->string('interior_number', 50)->nullable();
            $table->foreignId('settlement_id')->constrained('settlements')->onDelete('cascade');
            $table->string('reference_street_1', 255)->nullable();
            $table->string('reference_street_2', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
