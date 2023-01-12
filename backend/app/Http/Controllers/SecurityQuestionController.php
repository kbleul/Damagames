<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSecurityQuestionRequest;
use App\Http\Requests\UpdateSecurityQuestionRequest;
use App\Models\SecurityQuestion;

class SecurityQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return SecurityQuestion::all();
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
     * @param  \App\Http\Requests\StoreSecurityQuestionRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSecurityQuestionRequest $request)
    {
        return SecurityQuestion::create([
            'question' => $request->question,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SecurityQuestion  $securityQuestion
     * @return \Illuminate\Http\Response
     */
    public function show(SecurityQuestion $securityQuestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SecurityQuestion  $securityQuestion
     * @return \Illuminate\Http\Response
     */
    public function edit(SecurityQuestion $securityQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSecurityQuestionRequest  $request
     * @param  \App\Models\SecurityQuestion  $securityQuestion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSecurityQuestionRequest $request, SecurityQuestion $securityQuestion)
    {
        $securityQuestion->update([
            'question' => $request->question ??  $securityQuestion->question,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SecurityQuestion  $securityQuestion
     * @return \Illuminate\Http\Response
     */
    public function destroy(SecurityQuestion $securityQuestion)
    {
        return $securityQuestion->delete();
    }
}
