<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SendSmsController extends Controller
{
    public function sendSMS($phone, $otp)
    {
        try {
            $result = Http::post("http://197.156.70.196:9095/api/send_sms", [
                "username" => "Teret68438",
                "password" => "K0,yo%4!Q*'k1w<>RV)UOI`(4+xkkw",
                'to' => $phone,
                'text' => "Your verification number is: " . $otp
            ]);

            if ($result->ok()) {
                $response = [
                    'success' => true,
                    'message' => 'Successful',
                    'status' => 200,
                    'data' => '',
                ];

                return response()->json($response, 200);
            } else {
                $response = [
                    'success' => false,
                    'message' => 'Unsuccessful',
                    'status' => 500,
                    'data' => null
                ];

                return response()->json($response, 500);
            }
        } catch (\Exception $e) {
            $response = [
                'success' => false,
                'message' => 'Unsuccessful',
                'status' => 401,
                'data' => $e
            ];

            return response()->json($response, 401);
        }
    }
}
