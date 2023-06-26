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
            'league_id' => 'required|uuid',
            'season_name' => 'required|json|unique:seasons',
            'is_active' => 'required|boolean',
            'starting_date' => 'required|json',
            'ending_date' => 'required|json',
            'starting_time' => 'required|json',
            'ending_time' => 'required|json',
            'playing_day' => 'required|json',
        ];
    }
}