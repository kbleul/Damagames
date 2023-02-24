<?php

use App\Events\TestEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthPlayerController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayersController;
use App\Http\Controllers\PusherAuthController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\SecurityQuestionController;
use App\Http\Controllers\StoreController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/sockets/authenticate', [PusherAuthController::class, 'authenticate']);



Route::middleware('response')->group(function () {

    Route::post('join-game/{game}', [PlayersController::class, 'join_game']);
    Route::post('join-game-via-code', [PlayersController::class, 'join_game_via_code']);
    Route::post('add-player', [PlayersController::class, 'add_player']);
    Route::post('add-player/{game}', [PlayersController::class, 'start_game']);

    Route::resource('scores', ScoreController::class)->middleware('response');
    Route::post('draw/{game}', [ScoreController::class, 'draw']);

    Route::post('register', [AuthController::class, 'register_new']);
    Route::post('register/{user}', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::post('verify-otp', AuthController::class);

    Route::post('resend-otp', [AuthController::class, 'resend_otp']);

    Route::post('reset-password', [ResetPasswordController::class, 'reset_password']);

    Route::post('verify-password', ResetPasswordController::class);

    Route::post('reset-change-password', [ResetPasswordController::class, 'change_password'])->middleware('auth:sanctum');
    Route::post('finish-regster', [AuthController::class, 'finish_regster'])->middleware('auth:sanctum');

    Route::get('store-items', [StoreController::class, 'index']);
});

Route::resource('security-questions', SecurityQuestionController::class);

Route::middleware('response', 'auth:sanctum')->group(function () {
    Route::get('profile', function () {
        return User::find(auth()->id());
    });

    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('change-password', [AuthController::class, 'change_password']);
    Route::get('match-history', [GameController::class, 'match_history']);
    Route::post('update-profile-image', [AuthController::class, 'update_profile_image']);
    Route::post('auth-create-game', [AuthPlayerController::class, 'add_player']);
    Route::post('auth-join-game/{game}', [AuthPlayerController::class, 'join_game']);
    Route::post('auth-join-game-via-code', [AuthPlayerController::class, 'join_game_via_code']);
    Route::post('auth-start-game/{game}', [AuthPlayerController::class, 'start_game']);
    Route::post('security-question-answer', [AuthController::class, 'user_answer']);


    Route::post('purchase-item', [StoreController::class, 'purchase']);
    Route::get('my-items', [StoreController::class, 'my_items']);

    Route::post('select-board/{itemId}', [StoreController::class, 'select_board']);
    Route::post('select-avatar/{itemId}', [StoreController::class, 'select_avatar']);
    Route::post('select-crown/{itemId}', [StoreController::class, 'select_crown']);
});
