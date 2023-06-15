<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeasonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'league_id' => 'required|integer|in:leagues',
            'season_name' => 'required|string|unique:seasons',
            'starting_date' => 'required|date',
            'ending_date' => 'required|date|after:starting_date',
            'starting_time' => 'required|date',
            'ending_time' => 'required|date|after:starting_time',
        ];
    }
}
