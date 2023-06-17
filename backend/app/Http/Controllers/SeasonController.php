<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeasonRequest;
use App\Http\Requests\UpdateSeasonRequest;
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
        return $season;
    }

    public function update(UpdateSeasonRequest $request, Season $season)
    {
        $season = $season->update($request->validated());
        return $season;
    }

    public function destroy(Season $season)
    {
        $season->delete();
    }
}
