<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\medicine_items;
use App\Models\medicines;
use App\Models\purchase_transactions;
use Carbon\Carbon;
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

    public function GetAllExpiringMedicine()
    {
        $dateTomorrow = Carbon::tomorrow(); // e.g., 2025-04-14
        $dateOneMonth = Carbon::today()->addMonth(); // e.g., 2025-05-13

        $expiringMedicines = medicine_items::whereBetween('expiration_date', [
            $dateTomorrow->toDateString(),
            $dateOneMonth->toDateString()
        ])->with("medicine")->get();

        return response()->json($expiringMedicines);
    }
    
    public function GetAllExpiredMedicine()
    {
        $expiringMedicines = medicine_items::whereDate('expiration_date', '<=', Carbon::now())->with("medicine")->get();

        return response()->json($expiringMedicines);
    }
}
