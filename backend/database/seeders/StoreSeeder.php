<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $av1 = Store::create([
            'name' => "Lij Eyasu",
            'nickname' => "Nick Name",
            'price' => 2000.00,
            'type' => "Avatar",
        ]);
        $av1->addMediaFromUrl(asset('store/avatar/jij_eyasu.png'))->toMediaCollection('item');

        $av2 = Store::create([
            'name' => "Yohannes IV",
            'nickname' => "Nick Name",
            'price' => 4500.00,
            'type' => "Avatar",
        ]);
        $av2->addMediaFromUrl(asset('store/avatar/yohannes_IV.png'))->toMediaCollection('item');

        $av3 = Store::create([
            'name' => "Hailesilasse",
            'nickname' => "Nick Name",
            'price' => 4000.00,
            'type' => "Avatar",
        ]);
        $av3->addMediaFromUrl(asset('store/avatar/hailesilasse.png'))->toMediaCollection('item');

        $av4 = Store::create([
            'name' => "Minilik",
            'nickname' => "Nick Name",
            'price' => 4200.00,
            'type' => "Avatar",
        ]);
        $av4->addMediaFromUrl(asset('store/avatar/minilik.png'))->toMediaCollection('item');



        $av5 = Store::create([
            'name' => "Jagemakelo",
            'nickname' => "Nick Name",
            'price' => 3000.00,
            'type' => "Avatar",
        ]);
        $av5->addMediaFromUrl(asset('store/avatar/jagemakelo.png'))->toMediaCollection('item');

        $av6 = Store::create([
            'name' => "Balcha Abalula",
            'nickname' => "Nick Name",
            'price' => 3400.00,
            'type' => "Avatar",
        ]);
        $av6->addMediaFromUrl(asset('store/avatar/balcha_abalula.png'))->toMediaCollection('item');

        $av7 = Store::create([
            'name' => "Zewditu",
            'nickname' => "Nick Name",
            'price' => 4050.00,
            'type' => "Avatar",
        ]);
        $av7->addMediaFromUrl(asset('store/avatar/zewditu.png'))->toMediaCollection('item');


        $av8 = Store::create([
            'name' => "Aba Jifar",
            'nickname' => "Nick Name",
            'price' => 6000.00,
            'type' => "Avatar",
        ]);
        $av8->addMediaFromUrl(asset('store/avatar/aba_jifar.png'))->toMediaCollection('item');

        $av9 = Store::create([
            'name' => "Balcha Abanefso",
            'nickname' => "Nick Name",
            'price' => 2900.00,
            'type' => "Avatar",
        ]);
        $av9->addMediaFromUrl(asset('store/avatar/balcha_abanefso.png'))->toMediaCollection('item');

        $av10 = Store::create([
            'name' => "Etege Menen",
            'nickname' => "Nick Name",
            'price' => 1500.00,
            'type' => "Avatar",
        ]);
        $av10->addMediaFromUrl(asset('store/avatar/menen.png'))->toMediaCollection('item');

        $board1 = Store::create([
            'name' => "Royal",
            'nickname' => "",
            'price' => 1000.00,
            'type' => "Board",
            'color' => [
                'color1' => "#181920",
                'color2' => "#f7f1dd",
                'lastMoveColor' => "#ffffff",
            ],
        ]);
        $board1->addMediaFromUrl(asset('store/boards/royal.png'))->toMediaCollection('item');
        $board1->addMediaFromUrl('board_pawn1')->toMediaCollection('board_pawn1');
        $board1->addMediaFromUrl('board_pawn2')->toMediaCollection('board_pawn2');
        $board1->addMediaFromUrl('board_pawn1_turn')->toMediaCollection('board_pawn1_turn');
        $board1->addMediaFromUrl('board_pawn2_turn')->toMediaCollection('board_pawn2_turn');


        $board2 = Store::create([
            'name' => "Brass",
            'nickname' => "",
            'price' => 1300.00,
            'type' => "Board",
            'color' => [
                'color1' => "#f7f1dd",
                'color2' => "#181920",
                'lastMoveColor' => "#ffffff",
            ],
        ]);
        $board2->addMediaFromUrl(asset('store/boards/brass.png'))->toMediaCollection('item');
        $board2->addMediaFromUrl('board_pawn1')->toMediaCollection('board_pawn1');
        $board2->addMediaFromUrl('board_pawn2')->toMediaCollection('board_pawn2');
        $board2->addMediaFromUrl('board_pawn1_turn')->toMediaCollection('board_pawn1_turn');
        $board2->addMediaFromUrl('board_pawn2_turn')->toMediaCollection('board_pawn2_turn');


        $crown1 = Store::create([
            'name' => "Crown",
            'nickname' => "",
            'price' => 2000.00,
            'type' => "Crown",
        ]);
        $crown1->addMediaFromUrl(asset('store/crowns/crown.png'))->toMediaCollection('item');
    }
}
