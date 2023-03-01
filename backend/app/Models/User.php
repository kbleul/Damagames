<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
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

    public $appends = ['rank', 'coin'];

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
}
