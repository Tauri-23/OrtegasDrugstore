<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateFilenameService;
use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\medicines;
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
        $medicineId = $this->generateId->generate(medicines::class, 12);
        $medicine = new medicines();
        $medicine->id = $medicineId;
        $medicine->name = $request->medName;
        $medicine->price = $request->medPrice;
        $medicine->group = $request->medGp;
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
            $pic = $request->file('pic');
            $medicine = medicines::where('id', $request->medicine_id)->with('group')->first();

            $targetDirectory = base_path("react/src/assets/media/medicines");
            $newFilename = $this->generateFilename->generate($pic, $targetDirectory);

            $pic->move($targetDirectory, $newFilename);

            $medicine->pic = $newFilename;
            $medicine->save();

            return response()->json([
                'status' => 200,
                'message' => "Medicine picture updated.",
                'medicine' => $medicine
            ]);
            
        }
        catch(\Exception $e)
        {
            return response()->json([
                'status' => 500,
                'message' => "Something went wrong please try again later" . $e->getMessage()
            ]);
        }
    }
}
