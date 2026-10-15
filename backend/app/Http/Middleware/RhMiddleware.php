<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RhMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && in_array($request->user()->role, ['rh', 'admin'], true)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Accès refusé. Réservé aux responsables RH.',
        ], 403);
    }
}
