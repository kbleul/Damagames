<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SecurityQuestionAnswer extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    /**
     * Get all of the securityQuestion for the SQUser
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function securityQuestion(): HasMany
    {
        return $this->hasMany(SecurityQuestion::class);
    }
}
