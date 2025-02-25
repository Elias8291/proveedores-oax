<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEconomicActivitiesTable extends Migration
{
    public function up()
    {
        Schema::create('economic_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->constrained('economic_sectors');
            $table->foreignId('category_id')->constrained('activity_categories');
            $table->string('name');
            $table->string('code', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('economic_activities');
    }
}