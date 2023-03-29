<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\StoreItemStatusRequest;
use App\Http\Requests\StoreItemUpdateRequest;
use App\Models\CoinSetting;
use App\Models\Game;
use App\Models\Store;
use App\Models\User;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return [
            'users' => User::count(),
            'daily_playd' => 1000,
            'weekly_playd' => 10200,
            'monthly_playd' => 100999,
            'yearly_played' => 1000999,
        ];
    }

    public function users()
    {
        return [
            'users' => User::all()->map(function ($que) {
                $played = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount('scores')->get()->sum('scores_count');

                $wins = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount(['scores' => function ($query) use ($que) {
                    $query->where('winner', $que->id);
                }])->get()->sum('scores_count');

                $coin = User::find($que->id);

                $draw = Game::where('playerOne', $que->id)->orWhere('playerTwo', $que->id)->withCount(['scores' => function ($query) {
                    $query->where('draw', true);
                }])->get()->sum('scores_count');
                $que->match_history =  [
                    'rank' => $this->getRanking(auth()->id()),
                    'played' => $played,
                    'wins' => $wins,
                    'draw' =>  $draw,
                    'losses' => $played - ($wins + $draw),
                    'coins' => $coin->current_point,
                ];

                return $que;
            }),
        ];
    }

    public function getRanking($id)
    {
        $collection = collect(User::orderByDesc('current_point')
            ->get());

        $data = $collection->where('id', $id);

        if ($data->count() > 0) {
            return $data->keys()->first() + 1;
        } else {
            return 0;
        }
    }

    public function create_store_items(StoreItemRequest $request)
    {
        $item = Store::create([
            'name' => $request->name,
            'nickname' => $request->nickname,
            'price' => $request->price,
            'discount' => $request->discount,
            'type' => $request->type,
            'color' => [
                'color1' => $request->color1,
                'color2' => $request->color2,
                'lastMoveColor' => $request->lastMoveColor,
            ],
        ]);

        if ($request->type === "Board") {
            if ($request->hasFile('board_pawn1') && $request->file('board_pawn1')->isValid()) {
                $item->addMediaFromRequest('board_pawn1')->toMediaCollection('board_pawn1');
            }
            if ($request->hasFile('board_pawn2') && $request->file('board_pawn2')->isValid()) {
                $item->addMediaFromRequest('board_pawn2')->toMediaCollection('board_pawn2');
            }

            if ($request->hasFile('board_pawn1_turn') && $request->file('board_pawn1_turn')->isValid()) {
                $item->addMediaFromRequest('board_pawn1_turn')->toMediaCollection('board_pawn1_turn');
            }

            if ($request->hasFile('board_pawn2_turn') && $request->file('board_pawn2_turn')->isValid()) {
                $item->addMediaFromRequest('board_pawn2_turn')->toMediaCollection('board_pawn2_turn');
            }
        }

        $item->addMediaFromRequest('item')->toMediaCollection('item');

        return "Success";
    }

    public function store_item_update(StoreItemUpdateRequest $request, Store $store)
    {
        $store->update([
            'name' => $request->name ?? $store->name,
            'nickname' => $request->nickname ?? $store->nickname,
            'price' => $request->price ?? $store->price,
            'discount' => $request->discount ?? $store->discount,
            'type' => $request->type ?? $store->type,
            'color' => [
                'color1' => $request->color1 ?? $store->color['color1'],
                'color2' => $request->color2 ?? $store->color['color2'],
                'lastMoveColor' => $request->lastMoveColor ?? $store->color['lastMoveColor'],
            ],
        ]);

        if ($request->hasFile('item') && $request->file('item')->isValid()) {
            $store->clearMediaCollection('item');
            $store->addMediaFromRequest('item')->toMediaCollection('item');
        }

        if ($store->type === "Board") {
            if ($request->hasFile('board_pawn1') && $request->file('board_pawn1')->isValid()) {
                $store->clearMediaCollection('board_pawn1');
                $store->addMediaFromRequest('board_pawn1')->toMediaCollection('board_pawn1');
            }
            if ($request->hasFile('board_pawn2') && $request->file('board_pawn2')->isValid()) {
                $store->clearMediaCollection('board_pawn2');
                $store->addMediaFromRequest('board_pawn2')->toMediaCollection('board_pawn2');
            }

            if ($request->hasFile('board_pawn1_turn') && $request->file('board_pawn1_turn')->isValid()) {
                $store->clearMediaCollection('board_pawn1_turn');
                $store->addMediaFromRequest('board_pawn1_turn')->toMediaCollection('board_pawn1_turn');
            }

            if ($request->hasFile('board_pawn2_turn') && $request->file('board_pawn2_turn')->isValid()) {
                $store->clearMediaCollection('board_pawn2_turn');
                $store->addMediaFromRequest('board_pawn2_turn')->toMediaCollection('board_pawn2_turn');
            }
        }

        return "Updated";
    }

    public function store_item_delete(Request $request, Store $store)
    {
        $store->clearMediaCollection();
        return $store->delete();
    }

    public function store_item_status(StoreItemStatusRequest $request, Store $store)
    {
        // dd($request->active);
        if ($request->active) {
            $store->update([
                'status' => 0,
            ]);
            return  "Active";
        } else {

            $store->update([
                'status' => 1,
            ]);

            return  "Hidden";
        }
    }

    public function store_items()
    {
        return [
            'avatars' =>  Store::where('type', "Avatar")->orderBy('price', 'ASC')->get(),
            'boards' =>  Store::where('type', "Board")->orderBy('price', 'ASC')->get(),
            'crowns' =>  Store::where('type', "Crown")->get(),
        ];
    }

    public function coin_settings()
    {
        return CoinSetting::first();
    }

    public function coin_setting(Request $request, CoinSetting $coinSetting)
    {
        return $coinSetting->update([
            'newUserCoins' =>  $request->newUserCoins ?? $coinSetting->drawCoins,
            'winnerCoins' => $request->winnerCoins ?? $coinSetting->winnerCoins,
            'looserCoins' => $request->looserCoins ?? $coinSetting->looserCoins,
            'drawCoins' => $request->drawCoins ?? $coinSetting->drawCoins
        ]);
    }
}
