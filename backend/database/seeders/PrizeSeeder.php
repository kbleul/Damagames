<?php

namespace Database\Seeders;

use App\Models\Prize;
use Illuminate\Database\Seeder;

class PrizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $prizes = Prize::factory(10)->create();

        $images = collect([
            'https://cdn.pixabay.com/photo/2016/03/27/19/43/samsung-1283938_640.jpg',
            'https://cdn.pixabay.com/photo/2016/06/03/12/37/internet-search-engine-1433323_640.jpg',
        ]);

        foreach ($prizes as $prize) {
            $prize->addMediaFromUrl($images->random())->toMediaCollection('image');
        }
    }
}
