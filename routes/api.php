<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\MedicineGroupController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->group(function() {
        Route::get('/user', [AuthController::class, 'getUser']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });





/*
|----------------------------------------
| Public 
|----------------------------------------
*/
Route::post('/signup', [AuthController::class, 'SignupPost']);
Route::post('/login', [AuthController::class, 'login']);





/*
|----------------------------------------
| Medicine Groups 
|----------------------------------------
*/
Route::get('/get-all-medicine', [MedicineGroupController::class,'GetAllMedGroups']);
Route::post('/add-medicine-group-post', [MedicineGroupController::class, 'AddMedGroup']);





/*
|----------------------------------------
| Medicines 
|----------------------------------------
*/
Route::get('/get-all-medicines-full', [MedicineController::class,'GetAllMedicineFull']);
Route::get('/get-medicine-info-full-by-id/{medId}', [MedicineController::class,'GetFullMedicineInfoById']);

Route::post('/create-medicine', [MedicineController::class,'CreateMedicine']);
Route::post('/del-medicine', [MedicineController::class, 'DelMedicine']);
Route::post('/update-medicine', [MedicineController::class, 'UpdateMedicine']);