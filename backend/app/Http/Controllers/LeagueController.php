<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Score;
use App\Models\League;
use App\Models\Season;
use App\Models\CoinSetting;
use App\Models\SeasonPlayer;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreLeagueRequest;
use App\Http\Requests\UpdateLeagueRequest;

class LeagueController extends Controller
{
    public function index()
    {
        return League::with('seasons')->get();
    }

    public function store(StoreLeagueRequest $request)
    {
        $leagueName = League::whereJsonContains('league_name->english', json_decode($request->league_name)->english)
            ->orWhereJsonContains('league_name->amharic', json_decode($request->league_name)->amharic)
            ->first();

        if ($leagueName !== null) {
            return abort(404, "Amharic or English Name Already Exist!");
        }

        DB::beginTransaction();
        $league = League::create($request->validated());
        DB::commit();

        return response()
            ->json($league, 201);
    }

    public function show(League $league)
    {
        return $league->load('seasons');
    }

    public function update(UpdateLeagueRequest $request, League $league)
    {
        $leagueName = League::where('id', '!=', $league->id)->whereJsonContains('league_name->english', json_decode($request->league_name)->english)
            ->orWhereJsonContains('league_name->amharic', json_decode($request->league_name)->amharic)
            ->first();

        if ($leagueName !== null) {
            return abort(404, "Amharic or English Name Already Exist!");
        }

        $league->update($request->validated());

        return response()
            ->json("League Updated", 200);
    }

    public function destroy(League $league)
    {
        $league->forceDelete();
    }

    public function standings($seasonId)
    {
        $season = Season::where('id', $seasonId)->first();
        if (empty($season)) {
            return abort(400, 'Season not found');
        }

        $player = Score::where('season_id', $season->id)
            ->select('winner')
            ->union(Score::where('season_id', $season->id)->select('loser'))
            ->pluck('winner')
            ->unique()
            ->toArray();

        $userIds = SeasonPlayer::where('season_id', $season->id)->pluck('user_id');

        $gamePoint = User::all();

        $standings = [];
        foreach ($userIds as $userId) {
            $userData = $gamePoint->where('id', $userId)->first();
            $points = 0;

            foreach (Score::where('season_id', $seasonId)->get() as $score) {
                if ($score->winner == $userId && $score->draw != 1) {
                    $points += 3;
                }

                if ($score->draw == 1 && ($score->winner == $userId || $score->loser == $userId)) {
                    $points += 1;
                }
            }

            $standings[] = ['points' => $points, 'userData' => $userData];
        }

        usort($standings, function ($a, $b) {
            $pointsDiff = $b['points'] - $a['points'];
            if ($pointsDiff !== 0) {
                return $pointsDiff;
            }

            $nameDiff = strcmp($a['userData']->username, $b['userData']->username);
            return $nameDiff;
        });

        return ['is_game_time' => $season->is_game_time, 'users' => $standings];
    }

    public function histories($seasonId)
    {
        $season = Season::where('id', $seasonId)->where('is_active', 1)->first();
        if (empty($season)) {
            return abort(400, 'No active season found');
        }

        return Score::with('winnerScore', 'loserScore')
            ->where('season_id', $season->id)
            ->get()
            ->groupBy(function ($score) {
                return $score->created_at->format('Y-m-d');
            });
    }
}