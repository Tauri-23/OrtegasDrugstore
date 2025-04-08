<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\medicine_items;
use App\Models\medicines;
use App\Models\purchase_transaction_medicine_items;
use DB;
use Illuminate\Http\Request;

class MedicineItemsController extends Controller
{
    protected $generateId;


    public function __construct(IGenerateIdService $generateId)
    {
        $this->generateId = $generateId;
    }



    // POST
    public function AddMedicineItem(Request $request)
    {
        try
        {
            DB::beginTransaction();

            // Add Medicine Item
            $medicineItemId = $this->generateId->generate(medicine_items::class, 8);

            $medicineItem = new medicine_items();
            $medicineItem->id = $medicineItemId;
            $medicineItem->medicine = $request->medicine;
            $medicineItem->expiration_date = $request->expiration;
            $medicineItem->qty = $request->qty;

            // Increment the Medicine QTY
            $medicine = medicines::find($request->medicine);
            $medicine->qty += $request->qty;

            // Save Changes
            $medicine->save();
            $medicineItem->save();

            // LOG IT
            $log = new audit_logs();
            $log->inventory_activity = "Added medicine stock";
            $log->inventory_item_id= $request->medicine;
            $log->added_qty = $request->qty;
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
