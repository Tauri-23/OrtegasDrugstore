<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\medicine_groups;
use Illuminate\Http\Request;

class MedicineGroupController extends Controller
{
    protected $generateId;

    public function __construct(IGenerateIdService $generateId)
    {
        $this->generateId = $generateId;
    }

    // GET
    public function GetAllMedGroups()
    {
        return response()->json(medicine_groups::all());
    }




    // POST
    public function AddMedGroup(Request $request)
    {
        $medGroupId = $this->generateId->generate(medicine_groups::class, 6);

        $medGroup = new medicine_groups();
        $medGroup->id = $medGroupId;
        $medGroup->group_name = $request->name;

        if($medGroup->save())
        {
            return response()->json([
                'status' => 200,
                'message'=> 'Success',
                'id' => $medGroupId
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
}
