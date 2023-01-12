<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSecurityQuestionAnswerRequest;
use App\Http\Requests\UpdateSecurityQuestionAnswerRequest;
use App\Models\SecurityQuestionAnswer;

class SecurityQuestionAnswerController extends Controller
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
     * @param  \App\Http\Requests\StoreSecurityQuestionAnswerRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSecurityQuestionAnswerRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SecurityQuestionAnswer  $securityQuestionAnswer
     * @return \Illuminate\Http\Response
     */
    public function show(SecurityQuestionAnswer $securityQuestionAnswer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SecurityQuestionAnswer  $securityQuestionAnswer
     * @return \Illuminate\Http\Response
     */
    public function edit(SecurityQuestionAnswer $securityQuestionAnswer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSecurityQuestionAnswerRequest  $request
     * @param  \App\Models\SecurityQuestionAnswer  $securityQuestionAnswer
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSecurityQuestionAnswerRequest $request, SecurityQuestionAnswer $securityQuestionAnswer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SecurityQuestionAnswer  $securityQuestionAnswer
     * @return \Illuminate\Http\Response
     */
    public function destroy(SecurityQuestionAnswer $securityQuestionAnswer)
    {
        //
    }
}
