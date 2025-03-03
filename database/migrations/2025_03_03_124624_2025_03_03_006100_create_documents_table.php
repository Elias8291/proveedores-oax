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
    Schema::create('documents', function (Blueprint $table) {
        $table->id();
        $table->foreignId('person_data_id')->constrained('person_data')->onDelete('cascade');
        $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
        $table->string('file_path', 255);
        $table->string('file_name', 255);
        $table->unsignedBigInteger('file_size');
        $table->tinyInteger('is_current')->default(1);
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
