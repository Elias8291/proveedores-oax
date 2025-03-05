<?php
namespace App\Http\Controllers;

use App\Models\State; // Asegúrate de importar el modelo State
use App\Models\Municipality;
use App\Models\Localidad;
use App\Models\Settlement;
use Illuminate\Http\Request;

class LocationController extends Controller 
{
    /**
     * Obtener todos los estados
     */
    public function getStates()
    {
        $states = State::all(); // Obtener todos los estados
        return response()->json($states);
    }

    /**
     * Obtener municipios de un estado específico
     */
    public function getMunicipalitiesByState($stateId)
    {
        $municipalities = Municipality::where('state_id', $stateId)->get();
        return response()->json($municipalities);
    }

    /**
     * Obtener localidades de un municipio específico
     */
    public function getLocalidadesByMunicipality($municipalityId)
    {
        $localidades = Localidad::where('municipality_id', $municipalityId)->get();
        return response()->json($localidades);
    }

    /**
     * Obtener asentamientos de una localidad específica
     */
    public function getSettlementsByLocalidad($localidadId)
    {
        $settlements = Settlement::where('localidad_id', $localidadId)->get();
        return response()->json($settlements->map(function($settlement) {
            return [
                'id' => $settlement->id,
                'name' => $settlement->settlement_type . ' ' . $settlement->name,
                'settlement_type' => $settlement->settlement_type,
                'zip_code' => $settlement->zip_code
            ];
        }));
    }

    /**
     * Obtener asentamientos por código postal
     */
    public function getSettlementsByZipCode(Request $request)
    {
        $zipCode = $request->input('zip_code');

        $settlements = Settlement::where('zip_code', $zipCode)
            ->with(['localidad.municipality.state'])
            ->get()
            ->map(function($settlement) {
                return [
                    'id' => $settlement->id,
                    'name' => $settlement->settlement_type . ' ' . $settlement->name,
                    'settlement_type' => $settlement->settlement_type,
                    'settlement_name' => $settlement->name,
                    'zip_code' => $settlement->zip_code,
                    'localidad' => $settlement->localidad->name ?? '',
                    'municipality' => $settlement->localidad->municipality->name ?? '',
                    'state' => $settlement->localidad->municipality->state->name ?? ''
                ];
            });

        return response()->json($settlements);
    }
}