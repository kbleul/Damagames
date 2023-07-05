<?php

namespace Database\Seeders;

use App\Models\SeasonPlayer;
use Illuminate\Database\Seeder;

class SeasonPlayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SeasonPlayer::factory(10)->create();
    }
}
