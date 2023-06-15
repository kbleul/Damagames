<?php

namespace App\Models;

use App\Models\League;
use App\Models\SeasonPlayer;
use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Season extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = ['deleted_at', 'created_at', 'updated_at'];

    protected $casts = [
        'season_name' => 'json',
        'starting_date' => 'json',
        'ending_date' => 'json',
        'starting_time' => 'json',
        'ending_time' => 'json',
    ];

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function seasonPlayers(): HasMany
    {
        return $this->hasMany(SeasonPlayer::class);
    }
}
