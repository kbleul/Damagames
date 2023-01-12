<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerMovement implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $link;

    public $game;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($link, $game)
    {
        $this->link = $link;
        $this->game = $game;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('dama');
        // return new PrivateChannel('dama');
    }

    // public function broadcastAs()
    // {
    //     return "game";
    // }
}
