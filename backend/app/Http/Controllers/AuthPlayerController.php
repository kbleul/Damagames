<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGameRequest;
use App\Models\Bet;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthPlayerController extends Controller
{
    public function add_player(CreateGameRequest $request)
    {
        $user = User::find(auth()->id());

        if ($request->has_bet && $user->coin < ($request->coin * 1)) {
            abort(400, "Insufficient coin!");
        }

        DB::beginTransaction();

        do {
            $gameCode = random_int(100000, 999999);
        } while (Game::where('status', 0)->where('code', $gameCode)->exists());

        $game = Game::create([
            'playerOne' => $user->id,
            'code' => $gameCode,
            'status' => 0,
        ]);

        if ($request->has_bet) {
            Bet::create([
                'game_id' => $game->id,
                'coin' => $request->coin,
            ]);

            $game->update([
                'status' => 3,
            ]);
        }

        DB::commit();

        return response()
            ->json([
                'code' => $gameCode,
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $user,
                'ip' => request()->ip(),
                'is_bet' => $request->has_bet,
                'bet_coin' => $request->coin,
            ], 201);
    }

    public function join_game(Game $game)
    {

        // dd($game);
        if ($game->status !== 3) {
            return response()
                ->json([
                    'message' => 'This link is expired or it is not correct!',
                    'game' => $game,
                ], 400);
        }

        if ($game->status == 3) {
            $user = User::find(auth()->id());
            $bet = Bet::where('game_id', $game->id)->first();

            if ($user->coin < ($bet->coin * 1)) {
                abort(400, "Insufficient coin!");
            }
        }

        return response()
            ->json([
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $game->creator,
                'bet_coin' =>  $bet->coin,
            ], 201);
    }

    public function join_game_via_code(Request $request)
    {
        $game = Game::where('code', $request->code)->first();

        if (!$game) {
            abort(400, "This link is expired or it is not correct!");
        }

        if ($game->status === 3 && !Auth::check()) {
            abort(400, "This game requires login because it has bet!");
        }

        if ($game->status === 3) {
            $user = User::find(auth()->id());
            $bet = Bet::where('game_id', $game->id)->first();

            $betCoin = $bet->coin;
            if ($user->coin < ($bet->coin * 1)) {
                abort(400, "Insufficient coin!");
            }
        } else {
            $betCoin = 0;
        }

        return response()
            ->json([
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $game->creator,
                'bet_coin' =>  $betCoin,
            ], 201);
    }

    public function start_game(Game $game)
    {

        $game->update([
            'status' => 1,
        ]);

        $user = User::find(auth()->id());

        $game->update([
            'status' => 2,
            'playerTwo' => $user->id,
        ]);

        return response()
            ->json([
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $game->creator,
                'playerTwo' => $user,
                'ip' => request()->ip(),
            ], 201);
    }
}
