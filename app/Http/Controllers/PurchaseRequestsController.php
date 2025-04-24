<?php

namespace App\Http\Controllers;

use App\Models\purchase_request;
use DB;
use Illuminate\Http\Request;

class PurchaseRequestsController extends Controller
{
    // GET
    public function GetAllPurchaseRequests()
    {
        return response()->json(purchase_request::with(["requested_by", "medicine"])->get());
    }



    // POST
    public function CreatePurchaseRequest(Request $request)
    {
        try
        {
            DB::beginTransaction();
            $addPurchaseMed = json_decode($request->input("addPurchaseMed"));

            $purchaseReq = new purchase_request();
            $purchaseReq->medicine = $addPurchaseMed->medId;
            $purchaseReq->qty = $addPurchaseMed->medQty;
            $purchaseReq->supplier_name = $addPurchaseMed->supplierName;
            $purchaseReq->supplier_address = $addPurchaseMed->supplierAddress;
            $purchaseReq->supplier_contact_number = $addPurchaseMed->supplierContactNumber;
            $purchaseReq->supplier_contact_person = $addPurchaseMed->supplierContactPerson;
            $purchaseReq->requested_by = $addPurchaseMed->adminId;
            $purchaseReq->save();

            DB::commit();

            return response()->json([
                "status" => 200,
                "message" => "Success"
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
