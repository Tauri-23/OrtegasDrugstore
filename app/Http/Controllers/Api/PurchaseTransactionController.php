<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\medicines;
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

            if($request->hasDiscount == "true")
            {
                foreach($request->discounts as $discount)
                {
                    $transactionDiscount = new purchase_transaction_discounts();
                    $transactionDiscount->purchase_transaction = $transactionId;
                    $transactionDiscount->discount = $discount;
                    $transactionDiscount->save();
                }
            }            

            foreach($request->items as $key=>$item)
            {
                
                $transactionItem = new purchase_transaction_items();
                $transactionItem->purchase_transaction = $transactionId;
                $transactionItem->medicine = $item;
                $transactionItem->qty = $request->qty[$key];

                $medicine = medicines::find($item);
                $medicine->qty -= $request->qty[$key];
                
                $transactionItem->save();
                $medicine->save();
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'transaction' => purchase_transactions::with(['items', 'discounts', 'customer'])->find($transactionId)
            ]);
            
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => "Failed" . $e->getMessage()
            ]);
        }
    }

    public function VoidPurchase(Request $request)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            // Find the transaction
            $transaction = purchase_transactions::where('id', $request->transactionId)->first();
            $items = purchase_transaction_items::where('purchase_transaction', $transaction->id)->get();

            if (!$transaction) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Transaction not found'
                ]);
            }

            // Mark transaction as void
            $transaction->is_void = 1;

            // Restock the medicine because transaction is voided
            foreach ($items as $item) { // Accessing 'items' without parentheses if it's a relationship
                $medicine = medicines::find($item->medicine);

                if ($medicine) {
                    $medicine->qty += $item->qty;
                    $medicine->save();
                } else {
                    // Log or handle the missing medicine case as needed
                }
            }

            // Save the transaction after voiding it
            $transaction->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Transaction voided.',
                'medicines' => medicines::with('group')->get()
            ]);

        } catch (\Exception $e) {
            // Roll back on error
            DB::rollBack();

            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while voiding the transaction',
                'error' => $e->getMessage()
            ]);
        }
    }



    // GET
    public function GetAllPurchaseTransactions()
    {
        return response()->json(purchase_transactions::with(['items', 'discounts', 'customer'])->orderBy('created_at', 'DESC')->get());
    }

    public function GetAllPurchasTransactionsWhereDateRange($fromDate, $toDate)
    {
        // Ensure 'created_at' (not 'create_at') and add relationship filters
        $purchaseRecordBetweenDate = purchase_transactions::whereDate('created_at', '>=', $fromDate)->whereDate('created_at', '<=', $toDate)
        ->with('items')->get();

        return response()->json($purchaseRecordBetweenDate);
    }

}
