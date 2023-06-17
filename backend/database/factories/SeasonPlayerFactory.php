<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SeasonPlayer>
 */
class SeasonPlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $season = Season::pluck('id');
        $player = User::pluck('id');

        return [
            'season_id' => $this->faker->randomElement($season),
            'user_id' => $this->faker->randomElement($player),
        ];
    }
}
