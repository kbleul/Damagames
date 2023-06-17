<?php

namespace Database\Factories;

use App\Models\League;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Season>
 */
class SeasonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $leagueName = League::pluck('id');
        $seasonName = [[
            'english' => 'Winter',
            'amharic' => 'ክረምት',
        ], [
            'english' => 'Meher',
            'amharic' => 'መኽር',
        ], [
            'english' => 'Tsedey',
            'amharic' => 'ጸደይ',
        ], [
            'english' => 'Summer',
            'amharic' => 'በጋ',
        ]];
        $start_date = [['english' => '2023-06-15', 'amharic' => '2015-06-8'], ['english' => '2023-06-13', 'amharic' => '2015-07-8']];
        $end_date = [['english' => '2023-07-15', 'amharic' => '2015-07-8'], ['english' => '2023-04-15', 'amharic' => '2015-01-8']];
        $starting_time = [['english' => '2023-07-15-13:00:00', 'amharic' => '2015-07-8-17:00:00'],['english' => '2023-07-15-12:00:00', 'amharic' => '2015-07-4-11:08:00']];
        $ending_time = [['english' => '2023-07-15-03:06:00', 'amharic' => '2015-07-8-03:08:00'],'english' => '2023-07-15-03:06:04', 'amharic' => '2015-01-8-03:02:00'];

        return [
            'league_id' => $this->faker->randomElement($leagueName),
            'season_name' => $this->faker->randomElement($seasonName),
            'starting_date' => $this->faker->randomElement($start_date),
            'ending_date' => $this->faker->randomElement($end_date),
            'starting_time' => $this->faker->randomElement($starting_time),
            'ending_time' => $this->faker->randomElement($ending_time),
        ];
    }
}
