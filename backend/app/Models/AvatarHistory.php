<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AvatarHistory extends Model implements HasMedia
{
    use HasFactory, Uuids, SoftDeletes, InteractsWithMedia;
    protected $guarded = [];
    protected $appends = ['image'];
    protected $hidden = [
        'created_at',
        'media',
        'updated_at',
        'deleted_at',
        'status',
    ];

    protected $casts = [
        'history' => 'json',
        'updated_at' => 'datetime:d-M-Y',
        'created_at' => 'datetime:d-M-Y',
        'deleted_at' => 'datetime:d-M-Y',
    ];

    public function getImageAttribute()
    {
        $image = $this->getMedia('image')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }
}
