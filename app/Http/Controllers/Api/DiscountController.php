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
        return response()->json(discounts::where("status", "active")->get());
    }

    public function GetAllEnabledDiscount()
    {
        return response()->json(discounts::where("enabled", 1)->get());
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

    public function DeleteDiscount(Request $request)
    {
        try
        {
            DB::beginTransaction();
            $discount = discounts::find($request->discountId);

            if(!$discount)
            {
                return response()->json([
                    "status" => 404,
                    "message" => "Discount not found."
                ]);
            }

            $discount->status = "deleted";
            $discount->save();

            // LOG IT
            $log = new audit_logs();
            $log->settings_activity = "Deleted a discount";
            $log->discount = $discount->id;
            $log->admin = $request->admin;
            $log->type = "Settings";
            $log->save();

            DB::commit();

            return response()->json([
                "status" => 200,
                "message" => "success"
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json([
                "status" => 500,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    public function EditDiscount(Request $request)
    {
        try
        {
            DB::beginTransaction();
            $discount = discounts::find($request->discountId);

            if(!$discount)
            {
                return response()->json([
                    "status" => 404,
                    "message" => "Discount not found."
                ]);
            }

            // LOG IT
            $log = new audit_logs();
            $log->settings_activity = "Configured a discount";
            $log->discount = $discount->id;
            $log->old_discount_info = $discount->discount_name;
            $log->new_discount_info = $request->newName;
            $log->admin = $request->admin;
            $log->type = "Settings";
            $log->save();

            $discount->discount_name = $request->newName;
            $discount->save();

            DB::commit();

            return response()->json([
                "status" => 200,
                "message" => "success",
                "discounts" => discounts::all()
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json([
                "status" => 500,
                "message" => $e->getMessage()
            ], 500);
        }
    }
    public function EnableDisableDiscount(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $discount = discounts::find($request->discountId);

            if(!$discount)
            {
                return response()->json([
                    "status" => 404,
                    "message" => "Discount not found"
                ]);
            }

            $discount->enabled = !$discount->enabled;
            $discount->save();

            DB::commit();
            return response()->json([
                "status" => 200,
                "message" => "Success",
                "discounts" => discounts::all()
            ]);     
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json([
                "status" => 500,
                "message" => $e->getMessage()
            ], 500);
        }
    }
}
