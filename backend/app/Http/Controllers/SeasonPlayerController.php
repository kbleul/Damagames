<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Score;
use App\Models\Season;
use App\Models\SeasonPlayer;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreSeasonPlayerRequest;

class SeasonPlayerController extends Controller
{
    public function player_seasons($userId)
    {
        $seasonId = SeasonPlayer::where('user_id', $userId)->pluck('season_id')->unique();

        return Season::whereIn('id', $seasonId)->get()->filter(function ($season) use($userId){
              $wplayer = Score::where('season_id', $season->id)->where('winner' ,$userId)->pluck('loser');  
              $lplayer = Score::where('season_id', $season->id)->where('loser' ,$userId)->pluck('winner');  
              $season->have_played=$wplayer->merge($lplayer);
            return Carbon::parse(is_array($season->ending_date)?$season->ending_date["english"]: json_decode($season->ending_date, true)["english"]) >= now();
        })->flatten(1);
    }

    public function join_season(StoreSeasonPlayerRequest $request)
    {
        $season = Season::find($request->season_id);
        $user = User::find($request->user_id);
    
        if ($user->seasonPlayers()->where('season_id', $request->season_id)->exists()) {
            return response()->json(["message" => "User already joined this season"], 409);
        }
    
        if (!$user || !$season || $user->current_point < $season->season_price) {
            return response()->json(["message" => "User does not have enough coins to join the season"], 402);
        }
    
        DB::beginTransaction();
        
        $user->current_point -= $season->season_price;
        $user->save();
    
        $user->seasonPlayers()->create($request->validated());
    
        DB::commit();
    
        return response()->json(["message" => "User joined the season"], 200);
    }
}