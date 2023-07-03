<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeasonRequest;
use App\Http\Requests\UpdateSeasonRequest;
use App\Models\Score;
use App\Models\Season;
use Illuminate\Support\Facades\DB;

class SeasonController extends Controller
{
    public function index()
    {
        return Season::all();
    }

    public function store(StoreSeasonRequest $request)
    {
        DB::beginTransaction();
        $season = Season::create($request->validated());
        DB::commit();
        return response()->json($season, 201);
    }

    public function show(Season $season)
    {
        $histories = Score::with('winnerScore', 'loserScore')->where('season_id', $season->id)
            ->get()->groupBy(function ($score) {
            return $score->created_at->format('Y-m-d');
        });

        return ['season' => $season, 'histories' => $histories];
    }

    public function update(UpdateSeasonRequest $request, Season $season)
    {
        if($request->validated('is_active') ==1){
            $activeSeason =Season::where('league_id',$request->validated('league_id'))->whereNot('id',$season->id)->where('is_active',1)->first();
            if(isset($activeSeason)){
                $activeSeason->is_active=0;
                $activeSeason->save();
            }
        }
        $season = $season->update($request->validated());
        return $season;
    }

    public function destroy(Season $season)
    {
        $season->forceDelete();
    }
}
