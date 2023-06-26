<?php

namespace App\Models;

use App\Models\League;
use App\Models\Prize;
use App\Models\SeasonPlayer;
use App\Traits\Uuids;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Season extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = ['seasonPlayers', 'deleted_at', 'created_at', 'updated_at'];

    protected $appends = ['player_count', 'prizes', 'top3Player', 'is_game_time'];

    protected $casts = [
        'season_name' => 'json',
        'starting_date' => 'json',
        'ending_date' => 'json',
        'starting_time' => 'json',
        'ending_time' => 'json',
        'playing_day' => 'json',
        'is_active' => 'boolean',
    ];

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function seasonPlayers(): HasMany
    {
        return $this->hasMany(SeasonPlayer::class);
    }

    public function prizes(): HasMany
    {
        return $this->hasMany(Prize::class);
    }

    public function getPlayerCountAttribute()
    {
        return $this->seasonPlayers->count();
    }

    public function getPrizesAttribute()
    {
        return $this->prizes()->get();
    }

    public function getIsGameTimeAttribute()
    {
        $startDate = Carbon::parse(json_decode($this->starting_date, true)["english"]);
        $endDate = Carbon::parse(json_decode($this->ending_date, true)["english"]);
        $currentDate = Carbon::now();
        $startTime = Carbon::parse(json_decode($this->starting_time, true)["english"]);
        $endTime = Carbon::parse(json_decode($this->ending_time, true)["english"]);
        $currentDay = Carbon::now()->englishDayOfWeek;
        $days = json_decode($this->playing_day, true);

        return (in_array($currentDay, $days) && $currentDate->between($startDate, $endDate) && $currentDate->between($startTime, $endTime));
    }

    public function getTop3PlayerAttribute()
    {
        if ($this->is_active != 0) {
            return null;
        }

        $userIds = Score::where('season_id', $this->id)
            ->select('winner')
            ->union(Score::where('season_id', $this->id)->select('loser'))
            ->pluck('winner')
            ->unique()
            ->toArray();

        $gamePoint = User::all();

        $top3Player = [];
        foreach ($userIds as $userId) {
            $userData = $gamePoint->where('id', $userId)->first();
            $points = 0;
            foreach (Score::all() as $score) {
                if ($score->winner == $userId && $score->draw != 1) {
                    $points += 3;
                }

                if ($score->draw == 1) {
                    $points += 1;
                }
            }
            $top3Player[] = ['points' => $points, 'userData' => $userData];
        }

        usort($top3Player, function ($a, $b) {
            return $b['points'] - $a['points'];
        });

        $top3Player = array_slice($top3Player, 0, 3);

        return $top3Player;
    }
}