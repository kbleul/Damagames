<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAvatarHistoryRequest;
use App\Http\Requests\UpdateAvatarHistoryRequest;
use App\Models\AvatarHistory;

class AvatarHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * @param  \App\Http\Requests\StoreAvatarHistoryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAvatarHistoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AvatarHistory  $avatarHistory
     * @return \Illuminate\Http\Response
     */
    public function show(AvatarHistory $avatarHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AvatarHistory  $avatarHistory
     * @return \Illuminate\Http\Response
     */
    public function edit(AvatarHistory $avatarHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAvatarHistoryRequest  $request
     * @param  \App\Models\AvatarHistory  $avatarHistory
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAvatarHistoryRequest $request, AvatarHistory $avatarHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AvatarHistory  $avatarHistory
     * @return \Illuminate\Http\Response
     */
    public function destroy(AvatarHistory $avatarHistory)
    {
        //
    }
}
