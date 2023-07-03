<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeasonPlayerRequest;
use App\Models\Season;
use App\Models\SeasonPlayer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SeasonPlayerController extends Controller
{
    public function player_seasons($userId)
    {
        $seasonId = SeasonPlayer::where('user_id', $userId)->pluck('season_id')->unique();

        return Season::whereIn('id', $seasonId)->get()->filter(function ($season) {
            return Carbon::parse(json_decode($season->ending_date, true)["english"]) >= now();
        })->flatten(1);
    }

    public function join_season(StoreSeasonPlayerRequest $request)
    {
        $season = Season::where('id', $request->season_id)->first();
        $user = User::where('id', $request->user_id)->first();

        if (SeasonPlayer::where('user_id',$request->user_id)->where('season_id',$request->season_id)->exists()) {
            return response()
                ->json(["message" => "User already join this season"], 401);
        }

        if (!$user || !$season || $user->current_point < $season->coin_amount) {
            return response()
                ->json(["message" => "User does not have enough coins to join the season"], 404);
        }

        DB::beginTransaction();
        $user->current_point = $user->current_point - $season->coin_amount;
        $user->save();

        SeasonPlayer::create($request->validated());
        DB::commit();

        return response()
            ->json(["message" => "User joined the season"], 200);

    }
}