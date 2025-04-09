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
use App\Models\returned_transaction_items;
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
             * Update the medicine_items
             */
            foreach($request->items as $key=>$item)
            {
                /**
                 * For transaction Items record only
                 */
                $transactionItem = new purchase_transaction_items();
                $transactionItem->purchase_transaction = $transactionId;
                $transactionItem->medicine = $item;
                $transactionItem->qty = $request->qty[$key];
                $transactionItem->save();

                /**
                 * Get all the medItems of the medicine
                 */
                $medItems = medicine_items::where('medicine', $item)
                ->orderBy('expiration_date', 'asc')
                ->get();

                $demandedQty = $request->qty[$key];
                $medItemsUsed = []; // obj[]

                /**
                 * Loop through MedItems 
                 * - decrement the quantity of medItem
                 */
                foreach($medItems as $medItem)
                {
                    if ($demandedQty <= 0) {
                        break;
                    }
                    
                    /**
                     * If medItem's qty is enough for the demandedQty just decrement it
                     */
                    if ($medItem->qty >= $demandedQty) {
                        $medItemsUsed[] = [
                            "id" => $medItem->id,
                            "qty_purchased" => $demandedQty,
                            "medicine" => $medItem->medicine
                        ];
                        
                        $medItem->qty -= $demandedQty;
                        $medItem->save();
                        break;
                    } 
                    /**
                     * medItem's qty is not enought for the demandedQty 
                     * use all of its qty and proceed to the next medItem
                     */
                    else {
                        $medItemsUsed[] = [
                            "id" => $medItem->id,
                            "qty_purchased" => $medItem->qty, // because it uses all of its qty
                            "medicine" => $medItem->medicine
                        ];

                        $demandedQty -= $medItem->qty;
                        $medItem->qty = 0;
                        $medItem->save();
                    }
                }

                // Decrement the medicine
                $medicine = medicines::find($item);
                $medicine->qty -= $request->qty[$key];
                $medicine->save();


                /**
                 * Make a record of the deducted medItem for future purposes
                 */
                $transferData = [];
                foreach ($medItemsUsed as $medItemUsed) {
                    $transferData[] = [
                        'purchase_transaction_item' => $transactionItem->id,
                        'medicine_item_id' => $medItemUsed["id"],
                        'qty_purchased' => $medItemUsed["qty_purchased"],
                        'medicine' => $medItemUsed["medicine"],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Insert data in bulk
                purchase_transaction_medicine_items::insert($transferData);
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

    public function ReturnTransactionItem(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $retItem = json_decode($request->itemRet); // FROM REQUEST
            $tobeReplacedTransactionItem = purchase_transaction_items::with("medicine")->find($retItem->id);
            $purchaseTransaction = purchase_transactions::with("items")->find($tobeReplacedTransactionItem->purchase_transaction);
            $purchaseMedItems = purchase_transaction_medicine_items::where("purchase_transaction_item", $tobeReplacedTransactionItem->id)
            ->orderBy("created_at", "asc")
            ->get();

            $replacementMedicine = medicines::find($request->replacementmedId);
            

            /**
             * FIRST EDIT THE PURCHASE TRANSACTION
             */
            $percentOfDiscount = ($purchaseTransaction->discount_deduction / $purchaseTransaction->subtotal ) * 100;

            $deductedSubtotal = $tobeReplacedTransactionItem->medicine()->first()->price * $tobeReplacedTransactionItem->qty;
            $addedSubtotal = $replacementMedicine->price * $request->replacementQty; //Replacement Medicine Price and its quantity

            $updatedSubtotal = $purchaseTransaction->subtotal - $deductedSubtotal + $addedSubtotal;
            $updatedDiscountDeduction = $updatedSubtotal * ($percentOfDiscount / 100);
            $updatedTotal = $updatedSubtotal - $updatedDiscountDeduction;

            $purchaseTransaction->subtotal = $updatedSubtotal;
            $purchaseTransaction->discount_deduction = $updatedDiscountDeduction;
            $purchaseTransaction->total = $updatedTotal;
            $purchaseTransaction->cash = $updatedTotal;
            $purchaseTransaction->change = 0;
            $purchaseTransaction->save();


            /**
             * MOVE THE ITEM TO RETURNS
             */
            $returnedItems = new returned_transaction_items();
            $returnedItems->purchase_transaction = $purchaseTransaction->id;
            $returnedItems->medicine = $tobeReplacedTransactionItem->medicine()->first()->id;
            $returnedItems->qty = $retItem->qty;
            $returnedItems->reason = $retItem->reason;
            $returnedItems->replacement_medicine = $replacementMedicine->id;
            $returnedItems->replacement_qty = $request->replacementQty;
            $returnedItems->save();

            /**
             * Add the replacement to the purchase_transaction_med_items
             */
            $newPurchaseTransactionItem = new purchase_transaction_items();
            $newPurchaseTransactionItem->purchase_transaction = $purchaseTransaction->id;
            $newPurchaseTransactionItem->medicine = $replacementMedicine->id;
            $newPurchaseTransactionItem->qty = $request->replacementQty;
            $newPurchaseTransactionItem->save();

            // decrement the replacement medicine
            $replacementMedicine->qty -= $request->replacementQty;
            $replacementMedicine->save();

            /**
             * Get all the medItems of the medicine
             */
            $medItems = medicine_items::where('medicine', $replacementMedicine->id)
            ->orderBy('expiration_date', 'asc')
            ->get();

            $demandedQty = $request->replacementQty;
            $medItemsUsed = [];

            /**
             * Loop through MedItems 
             * - decrement the quantity of medItem
             */
            foreach($medItems as $medItem)
            {
                if ($demandedQty <= 0) {
                    break;
                }
                
                /**
                 * If medItem's qty is enough for the demandedQty just decrement it
                 */
                if ($medItem->qty >= $demandedQty) {
                    $medItemsUsed[] = [
                        "id" => $medItem->id,
                        "qty_purchased" => $demandedQty,
                        "medicine" => $medItem->medicine
                    ];
                    
                    $medItem->qty -= $demandedQty;
                    $medItem->save();
                    break;
                } 
                /**
                 * medItem's qty is not enought for the demandedQty 
                 * use all of its qty and proceed to the next medItem
                 */
                else {
                    $medItemsUsed[] = [
                        "id" => $medItem->id,
                        "qty_purchased" => $medItem->qty, // because it uses all of its qty
                        "medicine" => $medItem->medicine
                    ];

                    $demandedQty -= $medItem->qty;
                    $medItem->qty = 0;
                    $medItem->save();
                }
            }

            /**
             * Make a record of the deducted medItem for future purposes
             */
            $transferData = [];
            foreach ($medItemsUsed as $medItemUsed) {
                $transferData[] = [
                    'purchase_transaction_item' => $newPurchaseTransactionItem->id,
                    'medicine_item_id' => $medItemUsed["id"],
                    'qty_purchased' => $medItemUsed["qty_purchased"],
                    'medicine' => $medItemUsed["medicine"],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            purchase_transaction_medicine_items::insert($transferData);


            /**
             * Return All of the Items from the purchase_transaction_med_items
             * back to medicine_items
             */
            foreach($purchaseMedItems as $purchaseMedItem)
            {
                $medItem = medicine_items::find($purchaseMedItem->medicine_item_id);
                $medItem->qty += $purchaseMedItem->qty_purchased; //Increment Back
                $medItem->save();

                // Increment medicine back
                $medicine = medicines::find($purchaseMedItem->medicine);
                $medicine->qty += $purchaseMedItem->qty_purchased; // Increment Back
                $medicine->save();
            }

            /**
             * Next Remove the replaced Purchase Transction Item
             */
            $tobeReplacedTransactionItem->delete();

            DB::commit();

            return response()->json([
                "status" => 200,
                "message" => "success",
                "transaction" => purchase_transactions::with(['items', 'discounts', 'customer'])->find($tobeReplacedTransactionItem->purchase_transaction),
                "transactions" => purchase_transactions::with(["items", "discounts", "customer"])->orderBy("created_at", "desc")->get()
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

    public function GetAllReturnHistory()
    {
        return response()->json(returned_transaction_items::with(["medicine", "replacement_medicine"])->orderByDesc("created_at")->get());
    }
}
