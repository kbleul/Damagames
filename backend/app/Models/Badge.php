<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Badge extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, Uuids;

    protected $hidden = [
        'media',
        'nameAm',
        'status',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'name' => "json",
        'description' => "json",
        'point' => "integer",
        'created_at' => "datetime:Y-m-d",
        'updated_at' => "datetime:Y-m-d",
        'deleted_at' => "datetime:Y-m-d",
    ];
    protected $guarded = [];

    public $appends = ['badge_image'];


    public function getBadgeImageAttribute()
    {
        $image = $this->getMedia('badge_image')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }
}
