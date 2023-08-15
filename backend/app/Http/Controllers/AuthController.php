<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Season;
use App\Models\UserItem;
use App\Models\CoinSetting;
use App\Models\SeasonPlayer;
use Illuminate\Http\Request;
use App\Models\SecurityQuestion;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UsernameRequest;
use App\Models\SecurityQuestionAnswer;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ForgetPasswordRequest;
use App\Http\Requests\StoreSecurityQuestionAnswerRequest;

class AuthController extends SendSmsController
{

    public function __invoke(Request $request)
    {

        $user = User::where('phone', $request->phone)->first();

        // dd($request->phone);
        if (!empty($user->phone_verified_at)) {
            return response()->json(['message' => 'Already verified'], 400);
        }

        if (empty($user)) {
            abort(404, "User not found");
        }

        if (Hash::check($request['password'], $user->password)) {
            $credentials = request(['phone', 'password']);
            Auth::attempt($credentials);
            $token = $user->createToken('DAMA')->plainTextToken;
            $user->update(['phone_verified_at' => now()]);
            return response()->json(['message' => 'User Created successfully!', 'user' => auth()->user(), 'token' => $token], 201);
        } else {

            return response()->json(['message' => 'Password is incorrect.'], 400);
        }

        return response()->json(['message' => 'Something wrong.'], 400);
    }

    public function resend_otp(Request $request)
    {

        $password = rand(1000, 9999);

        $user = User::where('phone', $request->phone)->first();

        if (!empty($user) && !empty($user->phone_verified_at)) {
            return response()->json(['message' => 'User Already Verified.'], 400);
        }

        if (!empty($user) && empty($user->phone_verified_at)) {

            $this->sendSMS($request->phone, $password);

            return User::where('phone', $request->phone)->update(['password' => Hash::make($password)]);
        } else {
            return response()->json(['message' => 'User not found.'], 400);
        }
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('phone', $request->phone)->first();

        if (empty($user)) {
            abort(404, "Invalid Phone number");
        }

        $credentials = request(['phone', 'password']);
        if (Auth::attempt($credentials)) {
            $token = $user->createToken('DAMA')->plainTextToken;
            $user = auth()->user();
            $seasonIds = SeasonPlayer::where('user_id', auth()->id())->pluck('season_id')->unique();

            $season = Season::whereIn('id', $seasonIds)->get()->filter(function ($season) {
                return Carbon::parse(is_array($season->ending_date) ? $season->ending_date["english"] : json_decode($season->ending_date, true)["english"]) >= now();
            })->flatten(1);

            return response()->json([
                'message' => 'Logged In!',
                'token' => $token,
                'user' => $user,
                'seasons' => $season,
                'default_board' => UserItem::where('user_id', auth()->id())->whereRelation('item', 'type', 'Board')->first()->item ?? null,
                'default_crown' => UserItem::where('user_id', auth()->id())->whereRelation('item', 'type', 'Crown')->first()->item ?? null,
            ], 201);
        } else {
            return response()->json(['message' => 'Password is incorrect.'], 400);
        }
    }

    public function register_new(RegisterRequest $request)
    {
        $password = rand(1000, 9999);
        $user = User::where('phone', $request->phone)->first();
        if (!empty($user) && !empty($user->phone_verified_at)) {
            if (empty($user->username)) {
                $this->sendSMS($request->phone, $password);
                $user->update(['phone_verified_at' => null]);
                return User::where('phone', $request->phone)->update([
                    'password' => Hash::make($password),
                ]);
            }
            return response()->json(['message' => 'User Already Registered.'], 400);
        }

        if (!empty($user) && empty($user->phone_verified_at)) {
            $this->sendSMS($request->phone, $password);
            return User::where('phone', $request->phone)->update(['password' => Hash::make($password)]);
        }

        $this->sendSMS($request->phone, $password);

        $user = User::create([
            'phone' => $request->phone,
            'password' => Hash::make($password),
            'current_point' => CoinSetting::first()->newUserCoins,
        ]);

        return response()->json(['message' => 'OTP sent successfully!'], 201);
    }

    public function finish_regster(ResetPasswordRequest $request)
    {

        $user = User::find(auth()->id())->update([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully!', 'user' => User::find(auth()->id())], 201);
    }

    public function register(RegisterRequest $request, User $user)
    {
        $password = rand(1000, 9999);

        $user = User::where('phone', $request->phone)->first();

        if (!empty($user) && !empty($user->phone_verified_at)) {
            if (empty($user->username)) {
                $this->sendSMS($request->phone, $password);
                $user->update(['phone_verified_at' => null]);
                return User::where('phone', $request->phone)->update([
                    'password' => Hash::make($password),
                ]);
            }
            return response()->json(['message' => 'User Already Registered.'], 400);
        }

        if (!empty($user) && empty($user->phone_verified_at)) {
            $this->sendSMS($request->phone, $password);
            return User::where('phone', $request->phone)->update(['password' => Hash::make($password)]);
        }

        $this->sendSMS($request->phone, $password);

        $user = User::create([
            'phone' => $request->phone,
            'password' => Hash::make($password),
            'current_point' => CoinSetting::first()->newUserCoins,
        ]);

        return response()->json(['message' => 'OTP sent successfully!'], 201);
    }

    public function change_password(ChangePasswordRequest $request)
    {

        User::find(auth()->id())->update(['password' => Hash::make($request->new_password)]);

        return "Password changed successfully!";
    }

    public function update_profile_image(Request $request)
    {
        $user = User::find(auth()->id());

        $user->update([
            'profile_image' => $request->profile_image,
        ]);
        // $user->addMedia($request->profile_image)->toMediaCollection('profile_image');
        return User::find(auth()->id());
    }

    public function update_language(Request $request)
    {
        $user = User::find(auth()->id());

        $user->update([
            'language' => $request->language,
        ]);
        return User::find(auth()->id());
    }

    public function logout()
    {
        User::find(auth()->id())->tokens()->delete();
        return "user logged out";
    }

    public function user_answer(StoreSecurityQuestionAnswerRequest $request)
    {

        $squ = SecurityQuestionAnswer::where('user_id', auth()->id())->first();

        if (empty($squ)) {
            SecurityQuestionAnswer::create([
                'user_id' => auth()->id(),
                'security_question_id' => $request->security_question_id,
                'answer' => $request->answer,
            ]);
            return "created";
        } else {
            $squ->update([
                'security_question_id' => $request->security_question_id ?? $squ->security_question_id,
                'answer' => $request->answer ?? $squ->answer,
            ]);
            return "updated";
        }
    }

    public function forget_password(ForgetPasswordRequest $request)
    {
        $user = User::where('phone', $request->phone)->first();
        $sqa = SecurityQuestionAnswer::where('user_id', $user->id)->first();
        return SecurityQuestion::find($sqa->security_question_id);
    }

    public function update_username(UsernameRequest $request)
    {
        // dd("dasda");
        User::find(auth()->id())->update([
            'username' => $request->username,
        ]);
        return response()->json([
            'message' => 'Username updated successfully!',
            'user' => User::find(auth()->id()),
        ], 201);
    }
}
