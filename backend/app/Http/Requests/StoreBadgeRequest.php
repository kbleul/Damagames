<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBadgeRequest extends FormRequest
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
            'nameEnglish' => 'required',
            'nameAmharic' => 'required',
            'point' => 'required|numeric',
            'badge_image' => 'required|mimes:png,jpeg,jpg,svg,gif,bmp,bmp,tiff,webp|max:5000',
        ];
    }
}
