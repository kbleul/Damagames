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
        Schema::table('computer_game_nas', function (Blueprint $table) {
            $table->boolean('is_user_win')->nullable()->default(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('computer_game_nas', function (Blueprint $table) {
            $table->boolean('is_user_win')->nullable()->default(false)->change();
        });
    }
};
