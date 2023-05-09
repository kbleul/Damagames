<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
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
            'name' => 'required|unique:stores,name',
            'nameAm' => 'required',
            'historyAmharic' => 'required_if:type,Avatar',
            'historyEnglish' => 'required_if:type,Avatar',
            'price' => 'required|integer',
            'type' => 'required|in:Avatar,Crown,Board',
            'item' => 'required|mimes:png,jpeg,jpg,svg|max:5000',
            'color1' => 'required_if:type,Board',
            'color2' => 'required_if:type,Board',
            'lastMoveColor' => 'required_if:type,Board',
            'board_pawn1' => 'required_if:type,Board',
            'board_pawn2' => 'required_if:type,Board',
            'board_pawn1_turn' => 'required_if:type,Board',
            'board_pawn2_turn' => 'required_if:type,Board',
            'board_pawn_king1' => 'required_if:type,Board',
            'board_pawn_king2' => 'required_if:type,Board',
            'board_pawn_king1_turn' => 'required_if:type,Board',
            'board_pawn_king2_turn' => 'required_if:type,Board',
        ];
    }
}
