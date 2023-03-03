<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return [
            'users' => User::count(),
            'daily_playd' => 1000,
            'weekly_playd' => 10200,
            'monthly_playd' => 100999,
            'yearly_played' => 1000999,
        ];
    }

    public function users()
    {
        return [
            'users' => User::all()->map(function ($que) {
                $played = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount('scores')->get()->sum('scores_count');

                $wins = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount(['scores' => function ($query) use ($que) {
                    $query->where('winner', $que->id);
                }])->get()->sum('scores_count');

                $coin = User::find($que->id);

                $draw = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount(['scores' => function ($query) {
                    $query->where('draw', true);
                }])->get()->sum('scores_count');
                $que->match_history =  [
                    'rank' => $this->getRanking(auth()->id()),
                    'played' => $played,
                    'wins' => $wins,
                    'draw' =>  $draw,
                    'losses' => $played - ($wins + $draw),
                    'coins' => $coin->current_point,
                ];

                return $que;
            }),
        ];
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

    public function store_items()
    {
        return [
            'avatars' =>  Store::where('type', "Avatar")->orderBy('price', 'ASC')->get(),
            'boards' =>  Store::where('type', "Board")->orderBy('price', 'ASC')->get(),
            'crowns' =>  Store::where('type', "Crown")->get(),
        ];
    }
}
