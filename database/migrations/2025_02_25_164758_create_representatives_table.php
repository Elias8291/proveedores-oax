<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRepresentativesTable extends Migration
{
    public function up()
    {
        Schema::create('representatives', function (Blueprint $table) {
            $table->id();
            $table->string('name', 30);
            $table->string('first_last_name', 30);
            $table->string('second_last_name', 30);
            $table->string('curp', 18)->unique();
            $table->foreignId('faculty_id')->constrained('faculties');
            $table->foreignId('identification_type_id')->constrained('identification_types');
            $table->string('identification_number', 15);
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('representatives');
    }
}