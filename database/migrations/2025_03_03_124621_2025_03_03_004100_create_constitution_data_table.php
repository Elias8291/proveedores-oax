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
        Schema::create('constitution_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_data_id')->constrained('person_data')->onDelete('cascade');
            $table->string('deed_number', 50);
            $table->date('constitution_date');
            $table->string('notary_name', 100);
            $table->string('notary_number', 50);
            $table->string('registration_number', 50);
            $table->date('registration_date');
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
