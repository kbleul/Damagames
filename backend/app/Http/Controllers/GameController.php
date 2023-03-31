<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\ComputerGame;
use App\Models\Game;
use App\Models\Score;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function match_history()
    {


        $played = Game::where('playerOne', auth()->id())
            ->orWhere('playerTwo', auth()->id())
            ->withCount('scores')
            ->get()
            ->sum('scores_count');

        $wins = Game::where('playerOne', auth()->id())->orWhere('playerTwo', auth()->id())
            ->withCount(['scores' => function ($query) {
                $query->where('winner', auth()->id());
            }])->get()
            ->sum('scores_count');

        $coin = User::find(auth()->id());

        $draw = Game::where('playerOne', auth()->id())->orWhere('playerTwo', auth()->id())->withCount(['scores' => function ($query) {
            $query->where('draw', true);
        }])->get()->sum('scores_count');

        return  response()->json(
            [
                'rank' => $this->getRanking(auth()->id()),
                'played' => $played,
                'playedWithComputer' => ComputerGame::where('player', auth()->id())->count(),
                'wins' => $wins,
                'draw' =>  $draw,
                'losses' => $played - ($wins + $draw),
                'coins' => $coin->current_point,
            ],
            200
        );
    }

    public function getRanking($id)
    {
        $collection = collect(User::orderByDesc('current_point')
            ->get());

        $data = $collection->where('id', $id);

        if ($data->count() > 0) {
            return $data->keys()->first() + 1;
        } else {
            return 0;
        }
    }
}
