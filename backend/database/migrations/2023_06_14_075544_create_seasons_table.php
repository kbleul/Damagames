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
            $table->json('season_name');
            $table->json('starting_date')->nullable();
            $table->json('ending_date')->nullable();
            $table->json('starting_time')->nullable();
            $table->json('ending_time')->nullable();
$table->boolean('is_active')->default(0);
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
