<?php

namespace App\Http\Controllers;

use App\Models\EconomicSector;
use App\Models\EconomicActivity;
use Illuminate\Http\Request;

class EconomicSectorController extends Controller
{
    // Método para mostrar el formulario y pasar los sectores
    public function create()
    {
        // Obtener todos los sectores desde la base de datos
        $sectors = EconomicSector::all();

        // Retornar la vista con los sectores
        return view('yourview', compact('sectors')); // Pasa los sectores a la vista
    }

    // Método para obtener las actividades según el sector seleccionado
    public function getActivitiesBySector($sectorId)
    {
        // Obtener las actividades relacionadas con el sector
        $activities = EconomicActivity::where('sector_id', $sectorId)->get();

        // Devolver las actividades en formato JSON
        return response()->json($activities); 
    }
}
