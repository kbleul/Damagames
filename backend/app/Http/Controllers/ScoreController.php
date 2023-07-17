<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScoreRequest;
use App\Http\Requests\UpdateScoreRequest;
use App\Models\Bet;
use App\Models\CoinSetting;
use App\Models\Game;
use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;

class ScoreController extends GameController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::orderByDesc('current_point')->take(25)
            ->get();
    }

    public function top_four()
    {
        return User::orderByDesc('current_point')->take(4)
            ->get();
    }

    public function scores_by_point()
    {
        return User::take(50)
            ->get()
            ->sortBy('game_point');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreScoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreScoreRequest $request)
    {
        $game = Game::find($request->game_id);

        if ($game->playerOne == $request->winner) {
            $winner = $game->playerOne;
            $loser = $game->playerTwo;
        } else {
            $loser = $game->playerOne;
            $winner = $game->playerTwo;
        }

        $bet = Bet::where('game_id', $game->id)->first();

        if (!empty($bet)) {
            $coin = $bet->coin;
        } else {
            $coin = 0;
        }

        $Winer = User::find($winner);
        $losser = User::find($loser);

        $Winer->update([
            'current_point' => ($Winer->current_point + CoinSetting::first()->winnerCoins) + $coin,
        ]);

        $losser->update([
            'current_point' =>  $losser->current_point - CoinSetting::first()->looserCoins - $coin,
        ]);

        return Score::create([
            'game_id' => $request->game_id,
            'season_id' => $request->season_id ?? null,
            'winner' => $winner,
            'loser' => $loser,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Score  $score
     * @return \Illuminate\Http\Response
     */
    public function show(Score $score)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Score  $score
     * @return \Illuminate\Http\Response
     */
    public function edit(Score $score)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateScoreRequest  $request
     * @param  \App\Models\Score  $score
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateScoreRequest $request, Score $score)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Score  $score
     * @return \Illuminate\Http\Response
     */
    public function destroy(Score $score)
    {
        //
    }

    public function draw(Request $request, Game $game)
    {
        isset($request->season_id) ? Score::create([
            'game_id' => $game->id,
            'season_id' => $request->season_id,
            'winner' => $game->playerOne,
            'loser' => $game->playerTwo,
            'draw' => true,
        ]) : Score::create([
            'game_id' => $game->id,
            'draw' => true,
        ]);

        return response()
            ->json("It's a draw", 200);
    }
}