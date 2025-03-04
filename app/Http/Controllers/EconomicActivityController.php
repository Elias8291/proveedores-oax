<?php

namespace App\Http\Controllers;

use App\Models\EconomicActivity;
use Illuminate\Http\Request;

class EconomicActivityController extends Controller
{
    // Método para mostrar todas las actividades
    public function index()
    {
        $activities = EconomicActivity::all(); // Obtener todas las actividades
        return response()->json($activities); // Retornar las actividades
    }
}
