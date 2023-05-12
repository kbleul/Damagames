<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Store extends Model  implements HasMedia
{
    use HasFactory, InteractsWithMedia, Uuids;

    protected $guarded = [];
    protected $with = ['history'];

    protected $hidden = [
        'media',
        'nameAm',
        'updated_at',
        'deleted_at'
    ];



    protected $casts = [
        'status' => 'integer',
        'price' => "integer",
        'color' => "json",
        'history' => "json",
        'discount' => "integer",
        'created_at' => "datetime:Y-m-d",
        'updated_at' => "datetime:Y-m-d",
        'deleted_at' => "datetime:Y-m-d",
    ];

    public function toArray()
    {
        $attributes = parent::toArray();

        if ($this->type === "Avatar") {
            $hiddenAttributes = [
                'color',
                'history',
                'board_pawn1',
                'board_pawn2',
                'board_pawn1_turn',
                'board_pawn2_turn',
                'board_pawn_king1',
                'board_pawn_king2',
                'board_pawn_king1_turn',
                'board_pawn_king2_turn',
            ];
        } elseif ($this->type === "Crown") {
            $hiddenAttributes = [
                'color',
                'history',
                'board_pawn1',
                'board_pawn2',
                'board_pawn1_turn',
                'board_pawn2_turn',
            ];
        } else {
            return $attributes;
        }

        return array_diff_key($attributes, array_flip($hiddenAttributes));
    }

    public function getStatusAttribute($status)
    {
        if ($status == 0) {
            return $status = "Active";
        } else {
            return $status = "Not Active";
        }
    }

    public $appends = [
        'item_name',
        'item',
        'board_pawn1',
        'board_pawn2',
        'board_pawn1_turn',
        'board_pawn2_turn',
        'board_pawn_king1',
        'board_pawn_king2',
        'board_pawn_king1_turn',
        'board_pawn_king2_turn'

    ];

    public function getItemNameAttribute()
    {
        return [
            'english' => $this->name,
            'amharic' => $this->nameAm,
        ];
    }

    public function getItemAttribute()
    {
        $image = $this->getMedia('item')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawn1Attribute()
    {
        $image = $this->getMedia('board_pawn1')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawn2Attribute()
    {
        $image = $this->getMedia('board_pawn2')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawn1TurnAttribute()
    {
        $image = $this->getMedia('board_pawn1_turn')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawn2TurnAttribute()
    {
        $image = $this->getMedia('board_pawn2_turn')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawnKing1Attribute()
    {
        $image = $this->getMedia('board_pawn_king1')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawnKing2Attribute()
    {
        $image = $this->getMedia('board_pawn_king2')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawnKing1TurnAttribute()
    {
        $image = $this->getMedia('board_pawn_king1_turn')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    public function getBoardPawnKing2TurnAttribute()
    {
        $image = $this->getMedia('board_pawn_king2_turn')->last();

        if (!empty($image)) {
            return $image->getUrl();
        }
        return "";
    }

    /**
     * Get all of the history for the Store
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function history(): HasMany
    {
        return $this->hasMany(AvatarHistory::class, 'store_id');
    }
}
