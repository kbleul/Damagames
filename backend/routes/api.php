<?php

use App\Events\TestEvent;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthPlayerController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\ComputerGameController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayersController;
use App\Http\Controllers\PusherAuthController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\SecurityQuestionController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TelebirrController;
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
Route::post('telebirr/response', [TelebirrController::class, 'response']);

Route::middleware('response')->group(function () {
    Route::post('join-game/{game}', [PlayersController::class, 'join_game']);
    Route::post('join-game-via-code', [PlayersController::class, 'join_game_via_code']);
    Route::post('add-player', [PlayersController::class, 'add_player']);
    Route::post('add-player/{game}', [PlayersController::class, 'start_game']);

    Route::resource('scores', ScoreController::class)->middleware('response');
    Route::get('top-four', [ScoreController::class, 'top_four'])->middleware('response');
    Route::get('scores-by-point', [ScoreController::class, 'scores_by_point'])->middleware('response');
    Route::post('draw/{game}', [ScoreController::class, 'draw']);

    Route::post('register', [AuthController::class, 'register_new']);
    Route::post('register/{user}', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::post('verify-otp', AuthController::class);

    Route::post('resend-otp', [AuthController::class, 'resend_otp']);

    Route::post('reset-password', [ResetPasswordController::class, 'reset_password']);

    Route::post('verify-password', ResetPasswordController::class);
    Route::post('reset-change-password', [ResetPasswordController::class, 'change_password'])->middleware('auth:sanctum');
    Route::post('finish-regster', [AuthController::class, 'finish_regster'])->middleware('auth:sanctum', 'response');
    Route::post('update-username', [AuthController::class, 'update_username'])->middleware('auth:sanctum');
    Route::get('store-items', [StoreController::class, 'index']);
    Route::get('store-item-detail/{store}', [StoreController::class, 'store_item_show']);

    Route::post('game-exit/{game}', [PlayersController::class, 'game_status']);

    Route::post('play-with-computer-na', [ComputerGameController::class, 'store_na']);
    Route::post('play-with-computer-na-done/{computerGameNa}', [ComputerGameController::class, 'update_na']);
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
    Route::post('update-language', [AuthController::class, 'update_language']);
    Route::post('auth-create-game', [AuthPlayerController::class, 'add_player']);
    Route::post('auth-join-game/{game}', [AuthPlayerController::class, 'join_game']);
    Route::post('auth-join-game-via-code', [AuthPlayerController::class, 'join_game_via_code']);
    Route::post('auth-start-game/{game}', [AuthPlayerController::class, 'start_game']);
    // Route::post('security-question-answer', [AuthController::class, 'user_answer']);

    Route::post('play-with-computer', [ComputerGameController::class, 'store']);
    Route::post('play-with-computer-done/{computerGame}', [ComputerGameController::class, 'update']);

    Route::post('purchase-item', [StoreController::class, 'purchase']);
    Route::get('my-items', [StoreController::class, 'my_items']);

    Route::post('select-board/{itemId}', [StoreController::class, 'select_board']);
    Route::post('select-avatar/{itemId}', [StoreController::class, 'select_avatar']);
    Route::post('select-crown/{itemId}', [StoreController::class, 'select_crown']);
    Route::post('select-crown/{itemId}', [StoreController::class, 'select_crown']);

    // TELEBIRR
    Route::post('telebirr/pay', [TelebirrController::class, 'telebirr']);
});

Route::middleware(['response', 'auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    Route::get('users', [AdminController::class, 'users']);
    Route::post('create-store-items', [AdminController::class, 'create_store_items']);
    Route::get('store-items', [AdminController::class, 'store_items']);
    Route::post('update-store-item/{store}', [AdminController::class, 'store_item_update']);
    Route::delete('delete-store-item/{store}', [AdminController::class, 'store_item_delete']);
    Route::post('store-item-status/{store}', [AdminController::class, 'store_item_status']);
    Route::get('store-item-show/{store}', [AdminController::class, 'store_item_show']);
    Route::get('coin-settings', [AdminController::class, 'coin_settings']);
    Route::patch('coin-setting-update/{coinSetting}', [AdminController::class, 'coin_setting']);


    Route::resource('badges', BadgeController::class);
});
