<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seasons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('league_id')->constrained('leagues')->cascadeOnDelete();
            $table->string('season_name');
            $table->date('starting_date')->nullable();
            $table->date('ending_date')->nullable();
            $table->dateTime('starting_time')->nullable();
            $table->dateTime('ending_time')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('league_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seasons');
    }
};
