<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScoreRequest;
use App\Http\Requests\UpdateScoreRequest;
use App\Models\Game;
use App\Models\Score;
use Illuminate\Support\Facades\DB;

class ScoreController extends GameController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Score::where('draw', false)
            ->with('winner')
            ->select(DB::raw('count(*) * 10 as score, winner'))
            ->orderByDesc('score')
            ->groupBy('winner')
            ->get()->map(function ($query) {
                $query->rank = $this->getRanking($query->winner);

                return $query;
            });
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

        return Score::create([
            'game_id' => $request->game_id,
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

    public function draw(Game $game)
    {

        Score::create([
            'game_id' => $game->id,
            'draw' => true,
        ]);

        return response()
            ->json("It's a draw", 200);
    }
}
