<?php

namespace App\Http\Controllers;

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
