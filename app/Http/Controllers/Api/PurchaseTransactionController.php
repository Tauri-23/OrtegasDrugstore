<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\purchase_transaction_customer;
use App\Models\purchase_transaction_discounts;
use App\Models\purchase_transaction_items;
use App\Models\purchase_transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseTransactionController extends Controller
{
    protected $generateId;

    public function __construct(IGenerateIdService $generateId)
    {
        $this->generateId = $generateId;
    }



    //POST
    public function AddPurchase(Request $request)
    {
        try
        {
            DB::beginTransaction();
            $customerId = null;
            if($request->hasCustomer == "true")
            {
                $customer = new purchase_transaction_customer();
                $customer->name = $request->name;
                $customer->phone = $request->phone;
                $customer->address = $request->address;
                $customer->note = $request->note;
                $customer->save();
                $customerId = $customer->id;
            }

            $transactionId = $this->generateId->generate(purchase_transactions::class, 12);
            $transaction = new purchase_transactions();
            $transaction->id = $transactionId;
            $transaction->subtotal = $request->subtotal;
            $transaction->discount_deduction = $request->discount_deduction;
            $transaction->total = $request->total;
            $transaction->cash = $request->cash;
            $transaction->change = $request->change;
            $transaction->customer = $customerId;

            $transaction->save();

            foreach($request->discounts as $discount)
            {
                $transactionDiscount = new purchase_transaction_discounts();
                $transactionDiscount->purchase_transaction = $transactionId;
                $transactionDiscount->discount = $discount;
                $transactionDiscount->save();
            }

            foreach($request->items as $key=>$item)
            {
                $transactionItem = new purchase_transaction_items();
                $transactionItem->purchase_transaction = $transactionId;
                $transactionItem->medicine = $item;
                $transactionItem->qty = $request->qty[$key];
                $transactionItem->save();
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'transaction' => $transaction->with(['items', 'discounts', 'customer'])->get()
            ]);
            
        }
        catch(\Exception $e)
        {
            return response()->json([
                'status' => 500,
                'message' => "Failed" . $e->getMessage()
            ]);
        }
    }
}
