<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends SendSmsController
{
    public function __invoke(Request $request)
    {
        $user = User::where('phone', $request->phone)->first();

        if (!empty($user) && Hash::check($request['password'], $user->password)) {
            $user->update(['phone_verified_at' => now()]);
            $credentials = request(['phone', 'password']);
            Auth::attempt($credentials);
            $token = $user->createToken('DAMA')->plainTextToken;

            return response()->json(['user' => auth()->user(), 'token' => $token], 201);
        } else {
            return response()->json(['message' => 'Temporary password is not correct.'], 400);
        }
    }


    public function reset_password(Request $request)
    {

        $user = User::where('phone', $request->phone)->first();
        if (empty($user)) {
            return  response()->json(['message' => 'User not found.'], 400);
        }
        $password = rand(1000, 9999);
        $this->sendSMS($request->phone, $password);
        $user->update([
            'password' => Hash::make($password),
            'phone_verified_at' => null
        ]);
        return response()->json(['message' => 'Temporary password sent successfully!'], 201);
    }

    public function change_password(ResetPasswordRequest $request)
    {

        User::find(auth()->id())->update(['password' => Hash::make($request->password)]);

        return "Password changed successfully!";
    }
}
