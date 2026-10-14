<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\InterviewController;
use App\Models\User;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rh-users', function () {
        return User::where('role', 'rh')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    });

    Route::apiResource('candidates', CandidateController::class);

    Route::get('/candidates/{id}/cv', [
        CandidateController::class,
        'showCv'
    ]);

    Route::apiResource('interviews', InterviewController::class);
});