<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use App\Models\medicine_groups;
use DB;
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
        $medGroups = medicine_groups::orderBy('group_name', 'asc')->get();

        foreach ($medGroups as $medGroup) {
            $medGroup->total_qty = $medGroup->medicines()->sum('qty');
        }

        return response()->json($medGroups);
    }

    public function GetMedGroupWhereId($medGpId)
    {
        return response()->json(medicine_groups::find($medGpId));
    }




    // POST
    public function AddMedGroup(Request $request)
    {
        try
        {
            DB::beginTransaction();

            $medGroupId = $this->generateId->generate(medicine_groups::class, 6);

            $medGroup = new medicine_groups();
            $medGroup->id = $medGroupId;
            $medGroup->group_name = $request->name;
            $medGroup->save();

            // LOG IT
            $log = new audit_logs();
            $log->inventory_activity = "Added a new medicine group";
            $log->inventory_item_id = $medGroupId;
            $log->inventory_name = $request->name;
            $log->admin = $request->admin;
            $log->save();

            DB::commit();


            return response()->json([
                'status' => 200,
                'message'=> 'Success',
                'id' => $medGroupId
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

    public function DelMedGroup(Request $request)
    {
        $medGroup = medicine_groups::find($request->groupId);

        if(!$medGroup)
        {
            return response()->json([
                'status' => 401,
                'message' => "Medicine group doesn't exist."
            ]);
        }

        $medGroup->delete();
        return response()->json([
            'status' => 200,
            'message' => "Medicine group deleted."
        ]);
    }
}
