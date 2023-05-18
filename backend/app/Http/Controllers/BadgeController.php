<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBadgeRequest;
use App\Http\Requests\UpdateBadgeRequest;
use App\Models\Badge;

class BadgeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Badge::paginate(10);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreBadgeRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBadgeRequest $request)
    {
        $badge = Badge::create([
            'name' => [
                'english' =>  $request->nameEnglish,
                'amharic' =>  $request->nameAmharic
            ],
            'description' => [
                'english' =>  $request->descriptionEnglish,
                'amharic' =>  $request->descriptionAmharic
            ],
            'point' => $request->point
        ]);

        if ($request->hasFile('badge_image') && $request->file('badge_image')->isValid()) {
            $badge->addMediaFromRequest('badge_image')->toMediaCollection('badge_image');
        }

        return  $badge;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function show(Badge $badge)
    {
        return $badge;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function edit(Badge $badge)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateBadgeRequest  $request
     * @param  \App\Models\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBadgeRequest $request, Badge $badge)
    {
        $badge->update([
            'name' => [
                'english' =>  $request->nameEnglish ?? $badge->name['english'],
                'amharic' =>  $request->nameAmharic ?? $badge->name['amharic']
            ],
            'point' => $request->point ?? $badge->point
        ]);

        if ($request->hasFile('badge_image') && $request->file('badge_image')->isValid()) {
            $badge->clearMediaCollection('badge_image');
            $badge->addMediaFromRequest('badge_image')->toMediaCollection('badge_image');
        }

        return $badge;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function destroy(Badge $badge)
    {
        return $badge->delete();
    }
}
