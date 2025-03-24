<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\discounts;
use DB;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    // GET
    public function GetAllDiscount()
    {
        return response()->json(discounts::all());
    }



    // POST
    public function AddDiscount(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $discount = new discounts();
            $discount->discount_name = $request->discount_name;
            $discount->discount_type = $request->discount_type;
            $discount->discount_value = $request->discount_value;

            $discount->save();

            // LOG IT
            $log = new audit_logs();
            $log->settings_activity = "Added a new discount";
            $log->discount = $discount->id;
            $log->admin = $request->admin;
            $log->type = "Settings";
            $log->save();

            DB::commit();

            return response()->json([
                'status' => 200, 
                'message' => 'Discount Added',
                'discount' => $discount
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
