<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseItemRequest;
use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use App\Models\User;
use App\Models\UserItem;
use GrahamCampbell\ResultType\Success;

class StoreController extends Controller
{

    public function index()
    {
        return [
            'avatars' =>  Store::where('type', "Avatar")->where('status', 0)->orderBy('price', 'ASC')->get(),
            'boards' =>  Store::where('type', "Board")->where('status', 0)->orderBy('price', 'ASC')->get(),
            'crowns' =>  Store::where('type', "Crown")->where('status', 0)->get(),
        ];
    }

    public function store_item_show(Store $store)
    {
        return $store;
    }

    public function purchase(PurchaseItemRequest $request)
    {
        $item = Store::find($request->item_id);

        $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $request->item_id)->first();

        if (!empty($userItem)) {
            abort(400, "Already Purchased!");
        } elseif ($item->price > auth()->user()->current_point) {
            abort(400, "Insufficent Funds!");
        } else {
            User::find(auth()->id())->update([
                'current_point' => auth()->user()->current_point - $item->price,
            ]);
            return UserItem::create([
                'item_id' => $request->item_id,
                'user_id' =>  auth()->id(),
            ]);
        }
    }

    public function my_items()
    {
        return [
            'avatars' => auth()->user()->items->where('type', 'Avatar')->map(function ($query) {
                $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $query->id)->first();
                if ($userItem->status == 1) {
                    $query->is_selected = true;
                } else {
                    $query->is_selected = false;
                }
                return $query;
            }),
            'boards' => auth()->user()->items->where('type', 'Board')->map(function ($query) {
                $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $query->id)->first();
                if ($userItem->status == 1) {
                    $query->is_selected = true;
                } else {
                    $query->is_selected = false;
                }
                return $query;
            }),
            'crowns' => auth()->user()->items->where('type', 'Crown')->map(function ($query) {
                $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $query->id)->first();
                if ($userItem->status == 1) {
                    $query->is_selected = true;
                } else {
                    $query->is_selected = false;
                }
                return $query;
            })
        ];
    }

    public function select_avatar($itemId)
    {
        $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $itemId)->first();
        if (empty($userItem) || $userItem->item->type !== "Avatar") {
            abort(400, "Avatar Not Found!");
        }
        UserItem::where('user_id', auth()->id())
            ->whereRelation('item', 'type', 'Avatar')->update(['status' => 0]);
        $userItem->update([
            'status' => 1,
        ]);
        $user =  User::find(auth()->id());
        $user->update([
            'profile_image' => $userItem->item->item,
        ]);
        return "Avatar Selected";
    }

    public function select_crown($itemId)
    {
        $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $itemId)->first();
        if (empty($userItem) || $userItem->item->type !== "Crown") {
            abort(400, "Crown Not Found!");
        }
        UserItem::where('user_id', auth()->id())
            ->whereRelation('item', 'type', 'Crown')->update(['status' => 0]);
        $userItem->update([
            'status' => 1,
        ]);
        return "Crown Selected";
    }

    public function select_board($itemId)
    {
        $userItem = UserItem::where('user_id', auth()->id())->where('item_id', $itemId)->first();
        if (empty($userItem) || $userItem->item->type !== "Board") {
            abort(400, "Board Not Found!");
        }
        UserItem::where('user_id', auth()->id())
            ->whereRelation('item', 'type', 'Board')->update(['status' => 0]);
        $userItem->update([
            'status' => 1,
        ]);
        return "Board Selected";
    }
}
