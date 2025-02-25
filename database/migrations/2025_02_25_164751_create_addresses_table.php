<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    public function up()
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('street')->nullable();
            $table->string('exterior_number', 50)->nullable();
            $table->string('interior_number', 50)->nullable();
            $table->integer('zip_code');
            $table->string('reference_street_1')->nullable();
            $table->string('reference_street_2')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('addresses');
    }
}