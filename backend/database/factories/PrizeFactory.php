<?php

namespace Database\Factories;

use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prize>
 */
class PrizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $seasonId = Season::pluck('id');
        $prizeName = [[
            'english' => 'Mobile',
            'amharic' => 'ስልክ',
        ], [
            'english' => 'PC',
            'amharic' => 'ኮምፑተር',
        ]];

        $description = [[
            'english' => 'Samsung A30',
            'amharic' => 'ሳምሰንግ ',
        ], [
            'english' => 'Mac..',
            'amharic' => 'ማክ ኤም 1',
        ]];
        $level = ['1', '2', '3'];

        return [
            'season_id' => $this->faker->randomElement($seasonId),
            'prize_name' => $this->faker->randomElement($prizeName),
            'level' => $this->faker->randomElement($level),
            'description' => $this->faker->randomElement($description),
        ];
    }
}
