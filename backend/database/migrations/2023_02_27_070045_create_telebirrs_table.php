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
        Schema::create('telebirrs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transactionNo');
            $table->string('msisdn');
            $table->string('outTradeNo');
            $table->string('totalAmount');
            $table->string('tradeDate');
            $table->string('tradeNo');
            $table->string('tradeStatus');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('telebirrs');
    }
};
