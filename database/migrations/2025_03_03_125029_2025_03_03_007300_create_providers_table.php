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
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_data_id')->constrained('person_data')->onDelete('cascade');
            $table->foreignId('applicant_id')->nullable()->constrained('applicants')->onDelete('cascade');
            $table->string('pv', 10)->nullable();
            $table->foreignId('procedure_type_id')->constrained('procedure_types')->onDelete('cascade');
            $table->date('validity')->nullable();
            $table->tinyInteger('status')->default(1);
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
