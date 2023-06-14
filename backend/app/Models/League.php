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

    public function Seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }
}
