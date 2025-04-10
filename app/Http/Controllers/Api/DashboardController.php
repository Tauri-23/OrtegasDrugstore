<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\medicines;
use App\Models\purchase_transactions;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function GetAllRevenues()
    {
        return response()->json(purchase_transactions::sum('total'));
    }

    public function GetAllMedicineCount()
    {
        return response()->json(medicines::sum('qty'));
    }

    public function GetAllMedicineShortage()
    {
        return response()->json(medicines::with(["group"])->where('qty', "<", 20)->orderBy("qty", "desc")->get());
    }
}
