<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Teleebirr config
    |--------------------------------------------------------------------------
    |
    */
    'app_id' => env('TELEBIRR_APP_ID'),
    'app_key' => env('TELEBIRR_APP_KEY'),
    'public_key' => env('TELEBIRR_PUBLIC_KEY'),
    'short_code' => env('TELEBIRR_SHORT_CODE'),
    'app_url' => env('TELEBIRR_TB_APP_URL'),
    'web_url' => env('TELEBIRR_TB_WEB_URL'),
    'sdk_url' => env('TELEBIRR_TB_SDK_URL'),

    'notify_url' => env('TELEBIRR_NOTIFY_URL'),
    'return_url' => env('TELEBIRR_RETURN_URL'),

    'subject' => env('TELEBIRR_SUBJECT'),
    'receive_name' => env('TELEBIRR_RECIEVE_NAME'),
];
