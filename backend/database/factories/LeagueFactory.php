<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\League>
 */
class LeagueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $leagueName = [[
            'english' => 'Adwa',
            'amharic' => 'አድዋ',
        ], [
            'english' => 'Negus',
            'amharic' => 'ንጉስ',
        ], [
            'english' => 'Zufan',
            'amharic' => 'ዙፋን',
        ], [
            'english' => 'Zewed',
            'amharic' => 'ዘውድ',
        ]];

        $description = [[
            'english' => 'Adwa League ',
            'amharic' => 'አድዋ የጥቁር ህዝብ ኩራት',
        ], [
            'english' => 'Negus League the first..',
            'amharic' => 'ንጉስ',
        ], [
            'english' => 'Zufan is the most favorite',
            'amharic' => 'ዙፋን ይህ ሊግ',
        ], [
            'english' => 'Zewed awsome and',
            'amharic' => 'ዘውድ የመመጀመ',
        ]];
        $price = ['12', '3', '10', '4', '8'];

        return [
            'league_name' => $this->faker->unique()->randomElement($leagueName),
            'league_price' => $this->faker->randomElement($price),
            'status' => 1,
            'description' => $this->faker->randomElement($description),
        ];
    }
}
