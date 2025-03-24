<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\medicine_items;
use App\Models\medicines;
use App\Models\purchase_transaction_customer;
use App\Models\purchase_transaction_discounts;
use App\Models\purchase_transaction_items;
use App\Models\purchase_transaction_medicine_items;
use App\Models\purchase_transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

            /**
             * Update the medicine
             */
            foreach($request->items as $key=>$item)
            {
                $transactionItemToTransfers = medicine_items::where('medicine', $item)
                ->orderBy('expiration_date', 'asc')
                ->take($request->qty[$key])
                ->get();

                $transactionItem = new purchase_transaction_items();
                $transactionItem->purchase_transaction = $transactionId;
                $transactionItem->medicine = $item;
                $transactionItem->qty = $request->qty[$key];

                $medicine = medicines::find($item);
                $medicine->qty -= $request->qty[$key];
                
                $transactionItem->save();
                $medicine->save();

                /**
                 * transfer the medicine_item to purchase_transaction_item
                 */
                $transferData = [];
                foreach ($transactionItemToTransfers as $itemToTransfer) {
                    $transferData[] = [
                        'purchase_transaction_item' => $transactionItem->id,
                        'medicine_item_id' => $itemToTransfer->id,
                        'medicine' => $itemToTransfer->medicine,
                        'expiration_date' => $itemToTransfer->expiration_date,
                        'medicine_item_created_at' => $itemToTransfer->created_at,
                        'medicine_item_updated_at' => $itemToTransfer->updated_at,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Insert data in bulk
                purchase_transaction_medicine_items::insert($transferData);

                // Delete transferred medicine items
                medicine_items::whereIn('id', $transactionItemToTransfers->pluck('id'))->delete();
            }

            // LOG IT
            $log = new audit_logs();
            $log->sale_activity = "Sale for";
            $log->transaction = $transactionId;
            $log->cashier = $request->cashier;
            $log->type = "Sale";
            $log->save();

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
                $transactionItemToTransfers = purchase_transaction_medicine_items::where('purchase_transaction_item', $item->id)->get();

                $medicine->qty += $item->qty;
                $medicine->save();

                /**
                 * Transfer data from purchase_transaction_medicine_items back to medicine_items
                 */
                $transferData = [];
                foreach ($transactionItemToTransfers as $itemToTransfer) {
                    $transferData[] = [
                        'id' => $itemToTransfer->medicine_item_id,
                        'medicine' => $itemToTransfer->medicine,
                        'expiration_date' => $itemToTransfer->expiration_date,
                        'created_at' => $itemToTransfer->created_at,
                        'updated_at' => $itemToTransfer->updated_at
                    ];
                }

                // Insert data in bulk
                medicine_items::insert($transferData);

                // Delete transferred medicine items
                purchase_transaction_medicine_items::whereIn('id', $transactionItemToTransfers->pluck('id'))->delete();
            }

            // Save the transaction after voiding it
            $transaction->save();

            // LOG IT
            $log = new audit_logs();
            $log->sale_activity = "Void for";
            $log->transaction = $request->transactionId;
            $log->cashier = $request->cashier;
            $log->type = "Sale";
            $log->save();

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
    
    public function GetAllPurchaseTransactionItems()
    {
        return response()->json(purchase_transaction_items::with("medicine")->orderBy("created_at","ASC")->get());
    }

    public function GetAllPurchasTransactionsWhereDateRange($fromDate, $toDate)
    {
        // Ensure 'created_at' (not 'create_at') and add relationship filters
        $purchaseRecordBetweenDate = purchase_transactions::whereDate('created_at', '>=', $fromDate)->whereDate('created_at', '<=', $toDate)
        ->with('items')->get();

        return response()->json($purchaseRecordBetweenDate);
    }

    public function GenerateReport($month, $year){
        $purchaseTransactionsFullNow = purchase_transactions::
        whereMonth('created_at', $month)->whereYear('created_at', $year)
        ->with(['items', 'discounts', 'customer'])
        ->get();
        $extractedItemsNow = $purchaseTransactionsFullNow->pluck('items')->flatten();
        $totalSalesNow = purchase_transactions::
        whereMonth('created_at', $month)->whereYear('created_at', $year)->sum('total');
        $totalQtyNow = $purchaseTransactionsFullNow->pluck('items')->flatten()->sum('total');
        $newItems = medicines::whereMonth('created_at', $month)->whereYear('created_at', $year)->with('group')->get();


        $purchaseTransactionsFullLastMonth = purchase_transactions::
        whereMonth('created_at', $month - 1)->whereYear('created_at', $year)
        ->with(['items', 'discounts', 'customer'])
        ->get();
        $extractedItemsLastMonth = $purchaseTransactionsFullLastMonth->pluck('items')->flatten();
        $totalSalesLastMonth = purchase_transactions::
        whereMonth('created_at', $month - 1)->whereYear('created_at', $year)->sum('total');
        $totalQtyLastMonth = $extractedItemsLastMonth->pluck('items')->flatten()->sum('total');
        
        return response()->json([
            'purchase_transactions_now' => $purchaseTransactionsFullNow,
            'extracted_items_now' => $extractedItemsNow,
            'total_sales_now' => $totalSalesNow,
            'total_qty_now' => $totalQtyNow,
            'purchase_transactions_last_month' => $purchaseTransactionsFullLastMonth,
            'extracted_items_last_month' => $extractedItemsLastMonth,
            'total_sales_last_month' => $totalSalesLastMonth,
            'total_qty_last_month' => $totalQtyLastMonth,
            'new_items' => $newItems
        ]);
    }
}
