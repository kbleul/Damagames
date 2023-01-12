<?php

namespace App\Http\Controllers;

use Illuminate\Broadcasting\Broadcasters\PusherBroadcaster;
use Illuminate\Http\Request;
use Pusher\Pusher;

class PusherAuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $socketId = $request->socket_id;
        $channelName = $request->channel_name;

        $pusher = new PusherBroadcaster(
            new Pusher(
                env('PUSHER_APP_KEY'),
                env('PUSHER_APP_SECRET'),
                env('PUSHER_APP_ID'),
                []
            )
        );

        return $pusher->validAuthenticationResponse($request, []);

        // return $auth;
    }
}
