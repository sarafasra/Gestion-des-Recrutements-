<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\RhController;
use App\Http\Controllers\Api\SupervisionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/rh/dashboard-stats', [SupervisionController::class, 'rhDashboard']);
    Route::get('/admin/supervision', [SupervisionController::class, 'index'])
        ->middleware('admin');

    Route::get('/rh-users', [RhController::class, 'index']);

    Route::apiResource('candidates', CandidateController::class);

    Route::get('/candidates/{id}/cv', [
        CandidateController::class,
        'showCv'
    ]);

    Route::apiResource('interviews', InterviewController::class);

});