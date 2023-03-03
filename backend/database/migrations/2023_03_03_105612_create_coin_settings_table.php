<?php

use App\Models\CoinSetting;
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
        Schema::create('coin_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedInteger('newUserCoins')->default(0);
            $table->unsignedInteger('winnerCoins')->default(0);
            $table->unsignedInteger('looserCoins')->default(0);
            $table->unsignedInteger('drawCoins')->default(0);
            $table->unsignedInteger('status')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        $coinSetting = CoinSetting::firstOrNew(
            ['newUserCoins' =>  100],
            ['winnerCoins' => 50],
            ['looserCoins' => 0],
            ['drawCoins' => 0]
        );

        $coinSetting->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coin_settings');
    }
};
