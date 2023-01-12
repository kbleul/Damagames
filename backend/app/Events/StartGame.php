<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StartGame implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;

    public $status;

    public $game;

    public $playerOne;

    public $playerTwo;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userId, $status, $game, $playerOne, $playerTwo)
    {
        $this->userId = $userId;
        $this->status = $status;
        $this->game = $game;
        $this->playerOne = $playerOne;
        $this->playerTwo = $playerTwo;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('dama.'.$this->game);
    }

    public function broadcastAs()
    {
        return 'started';
    }
}
