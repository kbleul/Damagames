<?php

namespace App\Models;

use App\Traits\Uuids;
use App\Models\League;
use App\Models\SeasonPlayer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Season extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = ['deleted_at', 'created_at', 'updated_at'];

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function seasonPlayers(): HasMany
    {
        return $this->hasMany(SeasonPlayer::class);
    }
}
