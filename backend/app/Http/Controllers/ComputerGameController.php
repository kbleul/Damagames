<?php

namespace App\Http\Controllers;

use App\Models\CoinSetting;
use App\Models\ComputerGame;
use App\Models\ComputerGameNa;
use App\Models\User;
use Illuminate\Http\Request;

class ComputerGameController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return ComputerGame::create([
            'player' => auth()->id(),
        ]);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ComputerGame  $computerGame
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ComputerGame $computerGame)
    {
        if ($computerGame->status == 1) {
            abort(400, "Incorrect game");
        }


        $Winer = User::find($computerGame->player);
        $Winer->update([
            'current_point' => ($Winer->current_point + CoinSetting::first()->winnerCoins),
        ]);

        $computerGame->update([
            'status' => 1,
            'is_user_win' => $request->is_user_win ?? false,
        ]);

        return $Winer;
    }


    public function store_na(Request $request)
    {
        return ComputerGameNa::create([
            'player' => auth()->id(),
        ]);
    }

    public function update_na(Request $request, ComputerGameNa $computerGameNa)
    {
        if ($computerGameNa->status == 1) {
            abort(400, "Incorrect game");
        }

        $computerGameNa->update([
            'status' => 1,
            'is_user_win' => $request->is_user_win ?? false,
        ]);

        return $computerGameNa;
    }
}
