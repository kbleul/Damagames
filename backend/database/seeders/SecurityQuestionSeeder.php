<?php

namespace Database\Seeders;

use App\Models\SecurityQuestion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecurityQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SecurityQuestion::create(['question' => 'Your favorite number']);
        SecurityQuestion::create(['question' => 'Your favorite animal']);
        SecurityQuestion::create(['question' => 'Your birth address']);
        SecurityQuestion::create(['question' => 'Your primary school name']);
        SecurityQuestion::create(['question' => 'Your date of birth']);
        SecurityQuestion::create(['question' => 'Your mother name']);
    }
}
