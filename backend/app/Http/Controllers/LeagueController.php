<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeagueRequest;
use App\Http\Requests\UpdateLeagueRequest;
use App\Models\League;
use App\Models\Score;
use App\Models\Season;
use App\Models\User;
use DateTime;
use Illuminate\Support\Facades\DB;

class LeagueController extends Controller
{
    public function index()
    {
        return League::all();
    }

    public function store(StoreLeagueRequest $request)
    {
        DB::beginTransaction();
        $league = League::create($request->validated());
        DB::commit();

        return response()
            ->json($league, 201);
    }

    public function show(League $league)
    {
        return $league;
    }

    public function update(UpdateLeagueRequest $request, League $league)
    {
        $league->update($request->validated());

        return response()
            ->json("League Updated", 200);
    }

    public function destroy(League $league)
    {
        $league->delete();
    }

    public function standings($leagueId)
    {
        $season = Season::where('league_id', $leagueId)->where('is_active', 1)->first();
        if (empty($season)) {
            return abort(400, 'No active season found');
        }

        $userIds = Score::where('season_id', $season->id)
            ->select('winner')
            ->union(Score::where('season_id', $season->id)->select('loser'))
            ->pluck('winner')
            ->unique()
            ->toArray();

        $gamePoint = User::all();

        $standings = [];
        foreach ($userIds as $userId) {
            $userData = $gamePoint->where('id', $userId)->first();
            $points = 0;
            foreach (Score::all() as $score) {
                if ($score->winner == $userId && $score->draw != 1) {
                    $points += 3;
                }

                if ($score->draw == 1) {
                    $points += 1;
                }
            }
            $standings[] = ['points' => $points, 'userData' => $userData];
        }

        return $standings;
    }

    public function histories($leagueId)
    {
        $season = Season::where('league_id', $leagueId)->where('is_active', 1)->first();
        if (empty($season)) {
            return abort(400, 'No active season found');
        }

        $yesterday = new DateTime('yesterday');
        $latests = Score::with('winnerScore', 'loserScore')->where('season_id', $season->id)
            ->where('created_at', '>', $yesterday)->get();

        $olders = Score::with('winnerScore', 'loserScore')->where('season_id', $season->id)
            ->where('created_at', '<', $yesterday)->get();

        return ['yesterday' => $latests, 'older' => $olders];
    }
}
