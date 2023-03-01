<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // dd(auth()->user()->roles->contains('name', 'Admin'));
        if (auth()->user()->roles->contains('name', 'Admin')) {
            return $next($request);
        } else {
            return response()
                ->json([
                    'message' => "User doesn't have the right role",
                ], 401);
        }
    }
}
