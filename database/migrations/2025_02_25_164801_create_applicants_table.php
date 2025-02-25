<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicantsTable extends Migration
{
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_data_id')->constrained('person_data')->onDelete('cascade');
            $table->enum('application_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->json('form_progress')->nullable();
            $table->text('reviewer_comments')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applicants');
    }
}