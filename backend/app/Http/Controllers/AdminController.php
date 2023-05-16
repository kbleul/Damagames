<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\StoreItemStatusRequest;
use App\Http\Requests\StoreItemUpdateRequest;
use App\Models\AvatarHistory;
use App\Models\CoinSetting;
use App\Models\ComputerGame;
use App\Models\ComputerGameNa;
use App\Models\Game;
use App\Models\Score;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class AdminController extends Controller
{
    public function dashboard()
    {
        return [
            'users' => User::count(),
            'users_subscribed' => User::where('phone_verified_at', '!=', null)->count(),
            'auth_players_pwc' => ComputerGame::count(),
            'non_auth_players_pwc' => ComputerGameNa::count(),
            'total_games' => Score::count(),
            'daily_played' => Score::whereDate('created_at', Carbon::today())->count(),
            'weekly_played' => Score::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
            'monthly_played' => Score::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->count(),
            'yearly_played' => Score::whereBetween('created_at', [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()])->count(),
        ];
    }

    public function users(Request $request)
    {
        return User::when($request->search, function ($query, $search) {
            $query->where('username', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        })
            ->orderBy('current_point', 'desc')
            ->orderBy('phone_verified_at', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate(10);
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
        DB::beginTransaction();

        $item = Store::create([
            'name' => $request->name,
            'nameAm' => $request->nameAm,
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


        if ($request->type === "Avatar") {
            foreach ($request->history as $value) {
                $avatarHistory = AvatarHistory::create([
                    'store_id' => $item->id,
                    'history' => [
                        'english' => $value['historyEnglish'],
                        'amharic' => $value['historyAmharic']
                    ],
                ]);

                $image = $value['image'];

                if (isset($image) && $image->isValid()) {
                    $avatarHistory
                        ->addMedia($image)
                        ->preservingOriginal()
                        ->toMediaCollection('image');
                }
            }
        }

        if ($request->type === "Board" || $request->type === "Crown") {
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

            if ($request->hasFile('board_pawn_king1') && $request->file('board_pawn_king1')->isValid()) {
                $item->addMediaFromRequest('board_pawn_king1')->toMediaCollection('board_pawn_king1');
            }

            if ($request->hasFile('board_pawn_king2') && $request->file('board_pawn_king2')->isValid()) {
                $item->addMediaFromRequest('board_pawn_king2')->toMediaCollection('board_pawn_king2');
            }

            if ($request->hasFile('board_pawn_king1_turn') && $request->file('board_pawn_king1_turn')->isValid()) {
                $item->addMediaFromRequest('board_pawn_king1_turn')->toMediaCollection('board_pawn_king1_turn');
            }

            if ($request->hasFile('board_pawn_king2_turn') && $request->file('board_pawn_king2_turn')->isValid()) {
                $item->addMediaFromRequest('board_pawn_king2_turn')->toMediaCollection('board_pawn_king2_turn');
            }
        }

        $item->addMediaFromRequest('item')->toMediaCollection('item');
        DB::commit();
        return "Success";
    }

    public function store_item_update(StoreItemUpdateRequest $request, Store $store)
    {
        DB::beginTransaction();
        if ($store->type === "Board") {
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
        } else {

            $isfound = Store::where('name', $request->name)->first();

            dd(empty($isfound));
            if ($request->name == $store->name) {
                $name = $store->name;
            } else {
                $name = $request->name;
            }
            $store->update([
                'name' => $name ?? $store->name,
                'nameAm' => $request->nameAm ?? $store->nameAm,
                'nickname' => $request->nickname ?? $store->nickname,
                'price' => $request->price ?? $store->price,
                'discount' => $request->discount ?? $store->discount,
                'type' => $request->type ?? $store->type
            ]);

            if ($store->type === "Avatar") {
                foreach ($request->history as $value) {
                    $avatarHistory = AvatarHistory::create([
                        'store_id' => $store->id,
                        'history' => [
                            'english' => $value['historyEnglish'],
                            'amharic' => $value['historyAmharic']
                        ],
                    ]);
                    if (isset($value['image'])) {
                        $image = $value['image'];

                        if ($image->isValid()) {
                            $avatarHistory
                                ->addMedia($image)
                                ->preservingOriginal()
                                ->toMediaCollection('image');
                        }
                    }
                }
            }
        }

        if ($request->hasFile('item') && $request->file('item')->isValid()) {
            $store->clearMediaCollection('item');
            $store->addMediaFromRequest('item')->toMediaCollection('item');
        }

        if ($store->type === "Board" || $store->type === "Crown") {
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

            if ($request->hasFile('board_pawn_king1') && $request->file('board_pawn_king1')->isValid()) {
                $store->clearMediaCollection('board_pawn_king1');
                $store->addMediaFromRequest('board_pawn_king1')->toMediaCollection('board_pawn_king1');
            }

            if ($request->hasFile('board_pawn_king2') && $request->file('board_pawn_king2')->isValid()) {
                $store->clearMediaCollection('board_pawn_king2');
                $store->addMediaFromRequest('board_pawn_king2')->toMediaCollection('board_pawn_king2');
            }

            // dd($request->file('board_pawn_king1_turn')->isValid());
            if ($request->hasFile('board_pawn_king1_turn') && $request->file('board_pawn_king1_turn')->isValid()) {
                $store->clearMediaCollection('board_pawn_king1_turn');
                $store->addMediaFromRequest('board_pawn_king1_turn')->toMediaCollection('board_pawn_king1_turn');
            }


            if ($request->hasFile('board_pawn_king2_turn') && $request->file('board_pawn_king2_turn')->isValid()) {
                $store->clearMediaCollection('board_pawn_king2_turn');
                $store->addMediaFromRequest('board_pawn_king2_turn')->toMediaCollection('board_pawn_king2_turn');
            }
        }

        DB::commit();

        return "Updated";
    }

    public function store_item_delete(Request $request, Store $store)
    {
        $store->clearMediaCollection();
        return $store->delete();
    }

    public function store_item_status(StoreItemStatusRequest $request, Store $store)
    {
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

    public function store_item_show(Store $store)
    {
        return $store;
    }


    public function store_items()
    {
        $avatars = Store::where('type', "Avatar")->orderBy('price', 'ASC')->get();
        $boards = Store::where('type', "Board")->orderBy('price', 'ASC')->get();
        $crowns = Store::where('type', "Crown")->orderBy('price', 'ASC')->get();
        return [
            'avatars' =>  $avatars,
            'boards' =>   $boards,
            'crowns' =>  $crowns,
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
