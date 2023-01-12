<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SecurityQuestion extends Model
{
    use HasFactory, Uuids, SoftDeletes;

    protected $guarded = [];

    protected $hidden = [
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Get the securityQuestionAnswer that owns the SecurityQuestion
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function securityQuestionAnswer(): BelongsTo
    {
        return $this->belongsTo(SecurityQuestionAnswer::class);
    }
}
