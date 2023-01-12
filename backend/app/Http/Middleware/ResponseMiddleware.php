<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $result = $next($request);

        return $result->status() === 200 || $result->status() === 201 || $result->status() === 202 ?
            response()->json([
                'success' => true,
                'message' => $result->statusText(),
                'status' => $result->status() ?? 200,
                'data' => $result->original,
            ], $result->status() ?? 200) :
            response()->json([
                'success' => false,
                'message' => $result->statusText(),
                'status' => $result->status() ?? 500,
                'data' => $result->original['message'],
            ], $result->status() ?? 500);
    }
}
