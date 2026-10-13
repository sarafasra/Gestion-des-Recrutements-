<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SupervisionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('candidates', CandidateController::class);
    Route::get('/candidates/{id}/cv', [CandidateController::class, 'showCv']);

    Route::apiResource('interviews', InterviewController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/admin/supervision', [SupervisionController::class, 'index']);
});