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
    Schema::create('contact_information', function (Blueprint $table) {
        $table->id();
        $table->enum('entity_type', ['person_data', 'representative']);
        $table->unsignedBigInteger('entity_id');
        $table->string('phone', 15)->nullable();
        $table->string('mobile', 15)->nullable();
        $table->string('email', 150)->nullable();
        $table->tinyInteger('is_primary')->default(1);
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
