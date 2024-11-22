<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ForecastController extends Controller
{
    public function GetForecast()
    {
        $pythonScriptPath = base_path("python/forecasting.py");
        $output = [];
        $errorOutput = [];

        // Execute the Python script and capture both standard output and error output
        $command = "python " . escapeshellarg($pythonScriptPath);
        exec($command, $output, $returnVar);

        // Log output and error messages for debugging
        if ($returnVar != 0) {
            exec("python " . escapeshellarg($pythonScriptPath) . " 2>&1", $errorOutput);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to execute Python script',
                'error' => $errorOutput
            ], 500);
        } else {
            // Ensure the output is returned correctly as a JSON
            $result = implode('', $output); // Join the output array to get the full response
            return response()->json([
                'status' => 'success',
                'forecast' => json_decode($result, true) // Decode the JSON response from Python
            ]);
        }
    }

}
