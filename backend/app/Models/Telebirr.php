<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Telebirr extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];
}
