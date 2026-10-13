<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupervisionController extends Controller
{
    public function index()
    {

        $stats = [
            'total_users' => DB::table('users')->count(),
            'total_rh' => DB::table('users')->where('role', 'rh')->count(),
            'total_candidates' => DB::schema()->hasTable('candidates') ? DB::table('candidates')->count() : 0,
            'total_interviews' => DB::schema()->hasTable('interviews') ? DB::table('interviews')->count() : 0,
        ];

        $candidates = DB::schema()->hasTable('candidates') 
            ? DB::table('candidates')->latest()->get() 
            : [];

        return response()->json([
            'stats' => $stats,
            'candidates' => $candidates
        ]);
    }
}