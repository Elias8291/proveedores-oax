<?php

namespace App\Http\Controllers;

use App\Models\EconomicSector;
use App\Models\EconomicActivity;
use Illuminate\Http\Request;

class EconomicSectorController extends Controller
{
    
    public function create()
    {
        $sectors = EconomicSector::all(); // Obtener todos los sectores
        return view('formularios.formulario1', compact('sectors')); // Pasa los sectores a la vista
    }

    public function getActivitiesBySector($sectorId)
    {
        $activities = EconomicActivity::where('sector_id', $sectorId)->get(); // Obtener actividades por sector
        return response()->json($activities); // Retornar las actividades en formato JSON
    }
}
