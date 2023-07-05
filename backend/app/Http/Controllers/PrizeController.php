<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrizeRequest;
use App\Http\Requests\UpdatePrizeRequest;
use App\Models\Prize;
use Illuminate\Support\Facades\DB;

class PrizeController extends Controller
{
    public function index()
    {
        return Prize::all();
    }

    public function store(StorePrizeRequest $request)
    {
        DB::beginTransaction();
        $prize = Prize::create($request->validated());

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $prize->addMediaFromRequest('image')->toMediaCollection('image');
        }

        DB::commit();

        return response()
            ->json($prize, 201);
    }

    public function show(Prize $prize)
    {
        return $prize;
    }

    public function update(UpdatePrizeRequest $request, Prize $prize)
    {
        DB::beginTransaction();
        $prize->update($request->validated());

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $prize->clearMediaCollection('image');
            $prize->addMediaFromRequest('image')->toMediaCollection('image');
        }

        DB::commit();

        return response()
            ->json("Prize Updated", 200);
    }

    public function destroy(Prize $prize)
    {
        $prize->forceDelete();
    }
}
