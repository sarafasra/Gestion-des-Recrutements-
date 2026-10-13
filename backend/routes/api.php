
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\InterviewController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('candidates', CandidateController::class)
    ->middleware('auth:sanctum');

Route::get('/candidates/{id}/cv', [CandidateController::class, 'showCv'])
    ->middleware('auth:sanctum');

Route::apiResource('interviews', InterviewController::class)
    ->middleware('auth:sanctum');
