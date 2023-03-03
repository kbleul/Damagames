<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoinSetting extends Model
{
    use HasFactory, Uuids, SoftDeletes;
    protected $guarded = [];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'updated_at' => 'datetime:d-M-Y',
        'created_at' => 'datetime:d-M-Y',
        'deleted_at' => 'datetime:d-M-Y',
    ];
}
