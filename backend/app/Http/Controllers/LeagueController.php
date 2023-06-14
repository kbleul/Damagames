<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeagueRequest;
use App\Http\Requests\UpdateLeagueRequest;
use App\Models\League;
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
}
