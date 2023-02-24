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
            'avatars' =>  Store::where('type', "Avatar")->get(),
            'boards' =>  Store::where('type', "Board")->get(),
            'crowns' =>  Store::where('type', "Crown")->get(),
        ];
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
            'avatars' => auth()->user()->items->where('type', 'Avatar'),
            'boards' => auth()->user()->items->where('type', 'Board'),
            'crowns' => auth()->user()->items->where('type', 'Crown')
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
