<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use Illuminate\Http\Request;

class AuditLogsController extends Controller
{
    // GET
    public function GetAllAuditLogsWhereType($type) {
        switch($type) {
            case "Inventory":
                $auditLogs = audit_logs::where('type', $type)
                ->with(['admin'])->orderBy("created_at", "DESC")->get();
                break;
            case "Sale":
                $auditLogs = audit_logs::where('type', $type)
                ->with(['transaction', 'cashier'])->orderBy("created_at", "DESC")->get();
                break;
            case "Settings":
                $auditLogs = audit_logs::where('type', $type)
                ->with(['admin', 'discount'])->orderBy("created_at", "DESC")->get();
                break;
            default:
                return response()->json([
                    'status' => 401,
                    'message' => "Invalid Type"
                ]);
        }


        return response()->json($auditLogs);
    }
}
