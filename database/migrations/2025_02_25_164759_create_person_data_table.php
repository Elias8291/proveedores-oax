<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonDataTable extends Migration
{
    public function up()
    {
        Schema::create('person_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('legal_person', ['fisica', 'moral']);
            $table->string('rfc', 13)->unique();
            $table->string('curp', 18)->nullable()->unique();
            $table->string('business_name', 200);
            $table->string('tradename', 120)->nullable();
            $table->string('web_page', 100)->nullable();
            $table->enum('status', ['Pendiente', 'Validado', 'Rechazado'])->default('Pendiente');
            $table->foreignId('activity_id')->nullable()->constrained('economic_activities');
            $table->foreignId('classification_id')->constrained('classifications')->onDelete('cascade');
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('cascade');
            $table->foreignId('representative_id')->nullable()->constrained('representatives')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('person_data');
    }
}