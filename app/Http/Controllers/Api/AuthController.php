<?php

namespace App\Http\Controllers\Api;

use App\Contracts\IGenerateIdService;
use App\Http\Controllers\Controller;
use App\Models\user_admins;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $generateId;

    public function __construct(IGenerateIdService $generateId)
    {
        $this->generateId = $generateId;
    }

    /*
    |----------------------------------------
    | Login -- this will check all the userType Databases and check all your credentials 
    |----------------------------------------
    */
    public function login(Request $request)
    {
        $admin = user_admins::where("username", $request->uname)->first();

        if ($admin && $admin->password == $request->pass) {

            $token = $admin->createToken('main')->plainTextToken;

            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'user' => $admin,
                'token' => $token,
                'user_type' => "admin"
            ]);
        }
        else
        {
            return response()->json([
                'status' => 401,
                'message' => "Credentials don't match"
            ]);
        }
    }





    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) 
        {
            $user->tokens()->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Logged out successfully.'
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'User not authenticated.'
        ], 401);
    }




    public function getUser(Request $request) 
    {
        $user = $request->user();
        $userType = $user instanceof user_admins ? 'admin' : 'pharmacist'; //This is for now
        return response()->json([
            'user' => $user,
            'user_type' => $userType,
        ]);
    }
}
