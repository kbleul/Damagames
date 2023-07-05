<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeagueRequest extends FormRequest
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
            'league_name' => 'required|json|unique:leagues',
            'league_price' => 'required|numeric',
            'status' => 'nullable|boolean',
            'min_join_point' => 'integer',
            'description' => 'nullable|json',
        ];
    }
}