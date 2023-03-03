<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Teleebirr config
    |--------------------------------------------------------------------------
    |
    */
    'app_id' => env('APP_ID'),
    'app_key' => env('APP_KEY'),
    'public_key' => env('PUBLIC_KEY'),
    'short_code' => env('SHORT_CODE'),
    'app_url' => env('TB_APP_URL'),
    'web_url' => env('TB_WEB_URL'),
    'sdk_url' => env('TB_SDK_URL'),


    'notify_url' => env('NOTIFY_URL'),
    'return_url' => env('RETURN_URL'),

    'subject' => env('SUBJECT'),
    'receive_name' => env('RECIEVE_NAME'),
];
