<?php

namespace App\Models;

use App\Models\Season;
use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class League extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = ['deleted_at', 'created_at', 'updated_at'];

    protected $casts = [
        'league_name' => 'json',
        'description' => 'json',
    ];

    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }
}
