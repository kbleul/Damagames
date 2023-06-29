<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\SeasonPlayer;
use Carbon\Carbon;

class SeasonPlayerController extends Controller
{
    public function player_seasons($userId)
    {
        $seasonId = SeasonPlayer::where('user_id', $userId)->pluck('season_id')->unique();

        return Season::whereIn('id', $seasonId)->get()->filter(function ($season) {
            return Carbon::parse(json_decode($season->ending_date, true)["english"]) >= now();
        })->flatten(1);
    }
}
