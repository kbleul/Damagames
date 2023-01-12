<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthPlayerController extends Controller
{
    public function add_player()
    {
        $user = User::find(auth()->id());

        do {
            $gameCode = random_int(100000, 999999);
        } while (Game::where('status', 0)->where('code', $gameCode)->exists());


        $game = Game::create([
            'playerOne' => $user->id,
            'code' => $gameCode,
            'status' => 0,
        ]);

        // DB::commit();

        return response()
            ->json([
                'code' => $gameCode,
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $user,
                'ip' => request()->ip(),
            ], 201);
    }

    public function join_game(Game $game)
    {
        if ($game->status != 0) {
            return response()
                ->json([
                    'message' => 'This link is expired or it is not correct!',
                    'game' => $game,
                ], 400);
        }

        return response()
            ->json([
                'userId' => $game->playerOne,
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $game->creator,
            ], 201);
    }

    public function join_game_via_code(Request $request)
    {
        $game = Game::where('code', $request->code)->where('status', 0)->first();

        if (!$game) {
            return response()
                ->json([
                    'message' => 'This link is expired or it is not correct!',
                    'game' => $game,
                ], 400);
        }

        return response()
            ->json([
                'game' => $game->id,
                'status' => $game->status,
                'playerOne' => $game->creator,
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
