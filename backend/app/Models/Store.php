<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Store extends Model  implements HasMedia
{
    use HasFactory, InteractsWithMedia, Uuids;

    protected $guarded = [];

    protected $hidden = [
        'media',
        'status',
        'updated_at',
        'deleted_at'
    ];


    protected $casts = [
        'price' => "integer",
        'discount' => "integer",
        'created_at' => "datetime:Y-m-d",
        'updated_at' => "datetime:Y-m-d",
        'deleted_at' => "datetime:Y-m-d",
    ];

    public $appends = ['item'];

    public function getItemAttribute()
    {
        $image = $this->getMedia('item')->last();

        return $image->getUrl();
    }
}
