<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    use HasFactory,  Uuids, SoftDeletes;

    protected $guarded = [];

    public function creator()
    {
        return $this->hasOne(User::class, 'id', 'playerOne');
    }

    public function playerOne()
    {
        return $this->hasOne(User::class, 'id', 'playerOne');
    }

    public function playerTwo()
    {
        return $this->hasOne(User::class, 'id', 'playerTwo');
    }

    protected $casts = [
        'status' => 'integer',
    ];


    /**
     * Get all of the scores for the Game
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    public function Bet()
    {
        return $this->hasOne(Bet::class);
    }
}
