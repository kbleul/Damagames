<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Score;
use App\Models\SeasonPlayer;
use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Uuids, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    public $appends = ['rank', 'coin', 'game_point', 'match_history', 'seasons'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

    protected $hidden = [
        'password',
        'remember_token',
        'phone_verified_at',
        'updated_at',
        'deleted_at',
        'seasonPlayers',
    ];

    public function getRankAttribute()
    {
        $collection = collect(User::orderByDesc('current_point')
                ->get());

        $data = $collection->where('id', $this->id);

        if ($data->count() > 0) {
            return $data->keys()->first() + 1;
        } else {
            return 0;
        }
    }

    public function getCoinAttribute()
    {

        return $this->current_point;
    }

    public function getGamePointAttribute()
    {
        return ($this->match_history['wins'] * CoinSetting::first()->winnerCoins) + ($this->match_history['wins'] * CoinSetting::first()->drawCoins);
    }

    public function getMatchHistoryAttribute()
    {

        $completed = Game::where('playerOne', $this->id)
            ->orWhere('playerTwo', $this->id)
            ->whereHas('scores')
            ->withCount('scores')
            ->get()
            ->sum('scores_count');

        $incompleted = Game::where('playerOne', $this->id)
            ->orWhere('playerTwo', $this->id)
            ->whereDoesntHave('scores')
            ->count();

        $wins = Game::where('playerOne', $this->id)
            ->orWhere('playerTwo', $this->id)
            ->withCount(['scores' => function ($query) {
                $query->where('winner', $this->id);
            }])
            ->get()
            ->sum('scores_count');

        $coin = User::find($this->id);

        $draw = Game::where('playerOne', $this->id)
            ->orWhere('playerTwo', $this->id)
            ->withCount(['scores' => function ($query) {
                $query->where('draw', true);
            }])
            ->get()
            ->sum('scores_count');
        $match_history = [
            'played' => $completed + $incompleted,
            'started' => $completed + $incompleted,
            'completed' => $completed,
            'incompleted' => $incompleted,
            'playWithComputer' => ComputerGame::where('player', $this->id)->count(),
            'playWithComputerWins' => ComputerGame::where('player', $this->id, )->where('is_user_win', true)->count(),
            'playWithComputerLoses' => ComputerGame::where('player', $this->id)->where('is_user_win', false)->count(),
            'wins' => $wins,
            'draw' => $draw,
            'losses' => $completed - ($wins + $draw),
            'coins' => $coin->current_point,
        ];

        return $match_history;
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'current_point' => 'integer',
        'created_at' => 'datetime:d-m-Y H:i A',
    ];

    /**
     * Get the answer associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function answer(): HasOne
    {
        return $this->hasOne(SecurityQuestionAnswer::class);
    }

    /**
     * The items that belong to the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Store::class, 'user_items', 'user_id', 'item_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_users');
    }

    public function seasonPlayers(): HasMany
    {
        return $this->hasMany(SeasonPlayer::class);
    }

    public function winnerScore(): HasMany
    {
        return $this->hasMany(Score::class, 'winner');
    }

    public function loserScore(): HasMany
    {
        return $this->hasMany(Score::class, 'loser');
    }

    public function getSeasonsAttribute()
    {
        $seasonIds = $this->seasonPlayers->pluck('season_id')->unique();

        return Season::whereIn('id', $seasonIds)->get();
    }
}
