<?php

use App\Http\Controllers\Api\AuditLogsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\ForecastController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\MedicineGroupController;
use App\Http\Controllers\Api\MedicineItemsController;
use App\Http\Controllers\Api\PurchaseTransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->group(function() {
        Route::get('/user', [AuthController::class, 'getUser']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });





/*
|----------------------------------------
| Algo 
|----------------------------------------
*/
Route::get('/get-forecasted-data', [ForecastController::class,'GetForecast']);
Route::get('/get-forecasted-data-where-medicine/{medicineId}', [ForecastController::class,'GetForecastWhereMedicine']);





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
Route::get('/get-all-medicine-groups', [MedicineGroupController::class,'GetAllMedGroups']);
Route::get('/get-all-med-group-where-id/{medGpId}', [MedicineGroupController::class, 'GetMedGroupWhereId']);

Route::post('/add-medicine-group-post', [MedicineGroupController::class, 'AddMedGroup']);
Route::post('/delete-medicine-group', [MedicineGroupController::class, 'DelMedGroup']);





/*
|----------------------------------------
| Medicines 
|----------------------------------------
*/
Route::get('/get-all-medicines-full', [MedicineController::class,'GetAllMedicineFull']);
Route::get('/get-medicine-info-full-by-id/{medId}', [MedicineController::class,'GetFullMedicineInfoById']);
Route::get('/get-medicines-where-group/{groupId}', [MedicineController::class,'GetFullMedicines']);

Route::post('/create-medicine', [MedicineController::class,'CreateMedicine']);
Route::post('/del-medicine', [MedicineController::class, 'DelMedicine']);
Route::post('/update-medicine', [MedicineController::class, 'UpdateMedicine']);
Route::post('/update-medicine-pic', [MedicineController::class, 'UpdateMedicinePic']);





/*
|----------------------------------------
| Medicines 
|----------------------------------------
*/
Route::post('/add-medicine-item', [MedicineItemsController::class,'AddMedicineItem']);





/*
|----------------------------------------
| Discount 
|----------------------------------------
*/
Route::get('/get-all-discount', [DiscountController::class, 'GetAllDiscount']);

Route::post('/add-discount', [DiscountController::class, 'AddDiscount']);





/*
|----------------------------------------
| Purchase Transaction 
|----------------------------------------
*/
Route::get('/get-all-full-purchase-transactions', [PurchaseTransactionController::class, 'GetAllPurchaseTransactions']);
Route::get('/get-all-full-purchase-transactions-where-date-range/{fromDate}/{toDate}', [PurchaseTransactionController::class, 'GetAllPurchasTransactionsWhereDateRange']);
Route::get('/get-necessary-data-for-report/{month}/{year}', [PurchaseTransactionController::class, 'GenerateReport']);

Route::get('/get-all-full-purchase-transaction-items', [PurchaseTransactionController::class, 'GetAllPurchaseTransactionItems']);

Route::post('/add-purchase-transaction', [PurchaseTransactionController::class, 'AddPurchase']);
Route::post('/void-purchase-transaction', [PurchaseTransactionController::class, 'VoidPurchase']);





/*
|----------------------------------------
| Dashboard 
|----------------------------------------
*/
Route::get('/get-all-revenues', [DashboardController::class, 'GetAllRevenues']);
Route::get('/get-all-medicine-count', [DashboardController::class, 'GetAllMedicineCount']);
Route::get('/get-all-medicine-shortage', [DashboardController::class, 'GetAllMedicineShortage']);





/*
|----------------------------------------
| AUDIT LOGS 
|----------------------------------------
*/
Route::get('/get-all-audit-logs-where-type/{type}', [AuditLogsController::class, 'GetAllAuditLogsWhereType']);