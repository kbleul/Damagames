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
        Schema::create('prizes', function (Blueprint $table) {
            $table->uuid('id');
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->cascadeOnDelete();
            $table->integer('level');
            $table->json('prize_name');
            $table->json('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('season_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prizes');
    }
};
