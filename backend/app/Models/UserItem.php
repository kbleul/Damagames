<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserItem extends Model
{
    use HasFactory, Uuids;

    protected $guarded = [];

    protected $hidden = [
        'status',
        'pivot',
        'updated_at',
        'deleted_at'
    ];


    protected $casts = [
        'created_at' => "datetime:Y-m-d",
        'updated_at' => "datetime:Y-m-d",
        'deleted_at' => "datetime:Y-m-d",
    ];

    /**
     * Get the item associated with the UserItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function item(): HasOne
    {
        return $this->hasOne(Store::class, 'id', 'item_id');
    }
}
