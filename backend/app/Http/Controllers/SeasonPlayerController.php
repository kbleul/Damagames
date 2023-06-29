<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Season;
use App\Models\SeasonPlayer;

class SeasonPlayerController extends Controller
{
    public function player_seasons($userId)
    {
        $seasonId = SeasonPlayer::where('user_id', $userId)->pluck('season_id')->unique();

        return Season::whereIn('id', $seasonId)->get();
    }
}
