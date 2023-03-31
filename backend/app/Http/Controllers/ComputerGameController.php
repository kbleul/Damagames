<?php

namespace App\Http\Controllers;

use App\Models\CoinSetting;
use App\Models\ComputerGame;
use App\Models\User;
use Illuminate\Http\Request;

class ComputerGameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

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
     * Display the specified resource.
     *
     * @param  \App\Models\ComputerGame  $computerGame
     * @return \Illuminate\Http\Response
     */
    public function show(ComputerGame $computerGame)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ComputerGame  $computerGame
     * @return \Illuminate\Http\Response
     */
    public function update(ComputerGame $computerGame)
    {
        if ($computerGame->status == 1) {
            abort(400, "Incorrect game");
        }

        $Winer = User::find($computerGame->player->id);

        $Winer->update([
            'current_point' => ($Winer->current_point + CoinSetting::first()->winnerCoins),
        ]);

        $computerGame->update([
            'status' => 1,
        ]);

        return $Winer;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ComputerGame  $computerGame
     * @return \Illuminate\Http\Response
     */
    public function destroy(ComputerGame $computerGame)
    {
        //
    }
}
