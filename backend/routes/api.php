<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\RhController;
use App\Http\Controllers\Api\SupervisionController;
use App\Http\Controllers\Api\UserController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/supervision', [SupervisionController::class, 'index']);
        Route::apiResource('users', UserController::class)->except(['show']);
    });

    Route::middleware('admin.or.rh')->group(function () {
        Route::get('/candidates', [CandidateController::class, 'index']);
        Route::get('/candidates/{id}', [CandidateController::class, 'show']);
        Route::get('/candidates/{id}/cv', [CandidateController::class, 'showCv']);

        Route::get('/interviews', [InterviewController::class, 'index']);
        Route::get('/interviews/{id}', [InterviewController::class, 'show']);
    });

    Route::middleware('rh')->group(function () {
        Route::get('/rh/dashboard-stats', [SupervisionController::class, 'rhDashboard']);
        Route::get('/rh-users', [RhController::class, 'index']);

        Route::post('/candidates', [CandidateController::class, 'store']);
        Route::match(['put', 'patch'], '/candidates/{id}', [CandidateController::class, 'update']);
        Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);

        Route::post('/interviews', [InterviewController::class, 'store']);
        Route::match(['put', 'patch'], '/interviews/{id}', [InterviewController::class, 'update']);
        Route::delete('/interviews/{id}', [InterviewController::class, 'destroy']);
    });

});