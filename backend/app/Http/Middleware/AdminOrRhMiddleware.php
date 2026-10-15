<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOrRhMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && in_array($request->user()->role, ['admin', 'rh'], true)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Accès refusé.',
        ], 403);
    }
}
