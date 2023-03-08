<?php

use App\Events\PlayerMovement;
use App\Http\Controllers\TelebirrController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/telebirr', function () {
    return view('telebirr_test');
})->name('telebirr');



Route::get('/success', function () {
    return view('tb_success');
})->name('telebirr.success');

Route::post('telebirr/pay', [TelebirrController::class, 'telebirr'])->name('telebirr.pay');
Route::post('telebirr/response', [TelebirrController::class, 'response']);
