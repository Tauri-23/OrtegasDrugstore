<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateFilenameService;
use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\medicines;
use DB;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    protected $generateId;
    protected $generateFilename;

    public function __construct(IGenerateIdService $generateId, IGenerateFilenameService $generateFilename)
    {
        $this->generateId = $generateId;
        $this->generateFilename = $generateFilename;
    }


    // GET
    public function GetAllMedicineFull()
    {
        return response()->json(medicines::with(["group", "medicine_items"])->orderBy('name', 'asc')->get());
    }

    public function GetFullMedicineInfoById($medId)
    {
        return response()->json(medicines::with(["group", "medicine_items"])->where('id', $medId)->first());
    }

    public function GetFullMedicines($groupId)
    {
        return response()->json(medicines::with(["group", "medicine_items"])->where('group', $groupId)->orderBy('name', 'asc')->get());
    }




    // POST
    public function CreateMedicine(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $medicineParsed = json_decode($request->medicine);

            $medicineId = $this->generateId->generate(medicines::class, 12);
            $medicine = new medicines();
            $medicine->id = $medicineId;
            $medicine->name = $medicineParsed->medName;
            $medicine->price = $medicineParsed->medPrice;
            $medicine->group = $medicineParsed->medGroup;
            $medicine->type = $medicineParsed->medType;
            $medicine->save();

            // LOG IT
            $log = new audit_logs();
            $log->inventory_activity = "Added a new medicine";
            $log->inventory_item_id = $medicineId;
            $log->admin = $request->admin;
            $log->save();

            DB::commit();


            return response()->json([
                'status' => 200,
                'message' => 'Medicine successfully added.',
                'id' => $medicineId
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

    public function DelMedicine(Request $request)
    {
        $medicine = medicines::find($request->medId);

        if(!$medicine) {
            return response()->json([
                'status' => 404,
                'message' => 'Medicine not found.'
            ]);
        }

        if($medicine->delete())
        {
            return response()->json([
                'status' => 200,
                'message' => 'Medicine deleted.'
            ]);
        }
        else
        {
            return response()->json([
                'status' => 401,
                'message' => 'Something went wrong please try again later.'
            ]);
        }
    }

    public function UpdateMedicine(Request $request)
    {
        $medicine = medicines::where('id', $request->medId)->with('group')->first();

        if(!$medicine)
        {
            return response()->json([
                'status' => 404,
                'message' => 'Medicine does not exist.'
            ]);
        }

        switch($request->editType)
        {
            case "directions":
                $medicine->directions = $request->directions;
                break;
            case "sidefx":
                $medicine->side_effects = $request->sideFx;
                break;
            case "qty":
                $medicine->qty = $request->qty;
                break;
            default:
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid edit type.'
                ]);
        }

        if($medicine->save())
        {
            return response()->json([
                'status' => 200,
                'message' => 'Medicine updated.',
                'medicine' => $medicine
            ]);
        }
        else 
        {
            return response()->json([
                'status' => 401,
                'message' => 'Something went wrong please try again later.'
            ]);
        }
    }

    public function UpdateMedicinePic(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $pic = $request->file('pic');
            $medicine = medicines::where('id', $request->medicine_id)->with('group')->first();

            $targetDirectory = base_path("react/src/assets/media/medicines");
            $newFilename = $this->generateFilename->generate($pic, $targetDirectory);

            $pic->move($targetDirectory, $newFilename);

            $medicine->pic = $newFilename;
            $medicine->save();

            // LOG IT
            $log = new audit_logs();
            $log->inventory_activity = "Configured a medicine photo";
            $log->inventory_item_id = $request->medicine_id;
            $log->admin = $request->admin;
            $log->save();

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => "Medicine picture updated.",
                'medicine' => $medicine
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
