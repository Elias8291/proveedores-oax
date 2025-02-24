<?php


// Create a new controller: app/Http/Controllers/Auth/EmailCheckController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class EmailCheckController extends Controller
{
    public function checkExists(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json([
            'exists' => $exists
        ]);
    }
}