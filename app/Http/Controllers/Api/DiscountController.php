<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\discounts;
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
        $discount = new discounts();
        $discount->discount_name = $request->discount_name;
        $discount->discount_type = $request->discount_type;
        $discount->discount_value = $request->discount_value;

        if($discount->save())
        {
            return response()->json([
                'status' => 200, 
                'message' => 'Discount Added',
                'discount' => $discount
            ]);
        }
        else
        {
            return response()->json([
                'status' => 401, 
                'message' => 'Something went wrong when adding discount'
            ]);
        }
    }
}
