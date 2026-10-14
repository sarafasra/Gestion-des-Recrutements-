<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class RhController extends Controller
{
    public function index()
    {
        return User::where('role', 'rh')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }
}