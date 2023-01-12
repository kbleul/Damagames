<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use App\Models\Score;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function match_history()
    {


        $played = Game::where('playerOne', auth()->id())->orWhere('playerTwo', auth()->id())->withCount('scores')->get()->sum('scores_count');

        $wins = Game::where('playerOne', auth()->id())->orWhere('playerTwo', auth()->id())->withCount(['scores' => function ($query) {
            $query->where('winner', auth()->id());
        }])->get()->sum('scores_count');
        $draw = Game::where('playerOne', auth()->id())->orWhere('playerTwo', auth()->id())->withCount(['scores' => function ($query) {
            $query->where('draw', true);
        }])->get()->sum('scores_count');

        return  response()->json(
            [
                'rank' => $this->getRanking(auth()->id()),
                'played' => $played,
                'wins' => $wins,
                'draw' =>  $draw,
                'losses' => $played - ($wins + $draw),
                'coins' => $wins * 10,
            ],
            200
        );
    }

    public function getRanking($id)
    {
        $collection = collect(Score::where('draw', false)
            ->with('winner')
            ->select(DB::raw('count(*) * 10 as score, winner'))
            ->orderByDesc('score')
            ->groupBy('winner')
            ->get());
        $data       = $collection->where('winner', $id);
        $value      = $data->keys()->first() + 1;
        return $value;
    }
}
