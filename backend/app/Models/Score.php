<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Score extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = [
        'game_id',
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    /**
     * Get the game that owns the Score
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Get the winner that owns the Score
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner', 'id');
    }
}
