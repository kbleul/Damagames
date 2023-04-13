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
        return User::find(auth()->id())->match_history;
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
