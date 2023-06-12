<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComputerGame extends Model
{
    use HasFactory,  Uuids, SoftDeletes;

    protected $guarded = [];

    public function player()
    {
        return $this->hasOne(User::class, 'id', 'playerOne');
    }

    protected $casts = [
        'status' => 'integer',
    ];
}
