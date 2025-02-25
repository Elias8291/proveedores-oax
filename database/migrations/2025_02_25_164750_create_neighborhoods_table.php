<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNeighborhoodsTable extends Migration
{
    public function up()
    {
        Schema::create('neighborhoods', function (Blueprint $table) {
            $table->id();
            $table->integer('zip_code');
            $table->foreignId('city_id')->nullable()->constrained('cities');
            $table->string('name');
            $table->foreignId('settlement_type_id')->constrained('settlement_types');
            $table->foreignId('municipality_id')->constrained('municipalities');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('neighborhoods');
    }
}