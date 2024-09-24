<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\medicines;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    protected $generateId;

    public function __construct(IGenerateIdService $generateId)
    {
        $this->generateId = $generateId;
    }


    // GET
    public function GetAllMedicineFull()
    {
        return response()->json(medicines::with("group")->get());
    }




    // POST
    public function CreateMedicine(Request $request)
    {
        $medicineId = $this->generateId->generate(medicines::class, 12);
        $medicine = new medicines();
        $medicine->id = $medicineId;
        $medicine->name = $request->medName;
        $medicine->medicine_id = $request->medId;
        $medicine->group = $request->medGp;
        $medicine->qty = $request->medQty;
        $medicine->directions = $request->medDirection;
        $medicine->side_effects = $request->medSideFx;

        if($medicine->save())
        {
            return response()->json([
                'status' => 200,
                'message' => 'Medicine successfully added.',
                'id' => $medicineId
            ]);
        }
        else
        {
            return response()->json([
                'status' => 401,
                'message' => 'Something went wrong please try again.'
            ]);
        }
    }
}
