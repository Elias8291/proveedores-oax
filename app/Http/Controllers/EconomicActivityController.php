<?php

namespace App\Http\Controllers;

use App\Models\EconomicSector;
use Illuminate\Http\Request;

class EconomicActivityController extends Controller
{
    /**
     * Muestra el formulario de trámites.
     */
    public function showForm()
    {
        // Obtener todos los sectores económicos
        $sectors = EconomicSector::all();

        // Pasar los sectores a la vista
        return view('formularios.formulario1', compact('sectors'));
    }

    /**
     * Obtiene las actividades económicas asociadas a un sector (para AJAX).
     */
    public function getActivitiesBySector(EconomicSector $sector)
    {
        // Obtener las actividades del sector
        $activities = $sector->activities;

        // Devolver las actividades en formato JSON
        return response()->json($activities);
    }
}