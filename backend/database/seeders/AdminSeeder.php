<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'username' => 'Admin',
            'phone' => '251942533215',
            'password' =>  Hash::make("password"),
            'phone_verified_at' => now()
        ]);
        $admin = Role::create(['name' => 'Admin']);
        $user->roles()->sync($admin->id);
    }
}
