<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\medicine_items;
use App\Models\medicines;
use DB;
use Illuminate\Http\Request;

class MedicineItemsController extends Controller
{
    // POST
    public function AddMedicineItem(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $SkuExist = medicine_items::find($request->sku);

            if($SkuExist)
            {
                return response()->json([
                    'status' => 400,
                    'message' => 'SKU already exists'
                ]);
            }

            // Add Medicine Item
            $medicineItem = new medicine_items();
            $medicineItem->id = $request->sku;
            $medicineItem->medicine = $request->medicine;
            $medicineItem->expiration_date = $request->expiration;

            // Increment the Medicine QTY
            $medicine = medicines::find($request->medicine);
            $medicine->qty++;

            // Save Changes
            $medicine->save();
            $medicineItem->save();

            // LOG IT
            $log = new audit_logs();
            $log->inventory_activity = "Added medicine stock";
            $log->inventory_item_id= $request->medicine;
            $log->added_qty= 1;
            $log->admin = $request->admin;
            $log->save();

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Inventory item added.',
                'medicine' => medicines::with(['group', 'medicine_items'])->find($request->medicine)
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
