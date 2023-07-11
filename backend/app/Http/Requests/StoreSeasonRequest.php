<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
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
            'number_of_player'=>'nullable:integer',
            'is_active' => [
                'required',
                'boolean',
                Rule::unique('seasons')->where(function ($query) {
                    return $query->where('league_id', $this->input('league_id'))
                        ->where('is_active', true);
                })->ignore($this->input('id')),
            ],
            'starting_date' => 'required|json',
            'ending_date' => 'required|json',
            'starting_time' => 'required|json',
            'ending_time' => 'required|json',
            'playing_day' => 'required|json',
            'season_price'=>'required',
            'min_no_of_player' => 'nullable|integer',
        ];
    }
}
