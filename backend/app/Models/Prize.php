<?php

namespace App\Models;

use App\Models\Season;
use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Prize extends Model implements HasMedia
{
    use HasFactory, Uuids, SoftDeletes, InteractsWithMedia;

    protected $hidden = ['media', 'deleted_at', 'created_at', 'updated_at'];

    protected $appends = ['image'];

    protected $fillable = [
        'season_id',
        'prize_name',
        'level',
        'description',
    ];

    protected $casts = [
        'prize_name' => 'json',
        'description' => 'json',
    ];

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function getImageAttribute()
    {
        $image = $this->getMedia('image')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }
}
