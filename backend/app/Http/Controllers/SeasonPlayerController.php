<?php

namespace App\Http\Controllers;

use App\Models\SeasonPlayer;

class SeasonPlayerController extends Controller
{
    public function player_seasons($userId)
    {
        return SeasonPlayer::where('user_id', $userId)->get()->pluck('season_id');
    }
}
