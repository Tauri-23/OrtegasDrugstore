<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\audit_logs;
use Illuminate\Http\Request;

class AuditLogsController extends Controller
{
    // GET
    public function GetAllAuditLogs() {
        return response()->json(audit_logs::all());
    }
}
