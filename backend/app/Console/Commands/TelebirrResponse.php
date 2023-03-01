<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TelebirrResponse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telebirr:response';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'The third party system receives the response parameters of the payment result and it need to send a call back notification response to telebirr platform';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        return $this->arguments();
    }
}
