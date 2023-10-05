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
        Schema::table('computer_games', function (Blueprint $table) {
            $table->boolean('is_user_win')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('computer_games', function (Blueprint $table) {
            $table->boolean('is_user_win')->nullable(false)->default(false)->change();
        });
    }
};
