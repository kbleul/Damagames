<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComputerGameNa extends Model
{
    use HasFactory,  Uuids;

    protected $guarded = [];

    protected $casts = [
        'status' => 'integer',
    ];
}
