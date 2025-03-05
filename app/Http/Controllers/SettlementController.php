<?php
namespace App\Http\Controllers;

use App\Models\Settlement;
use Illuminate\Http\Request;

class SettlementController extends Controller 
{
    /**
     * Obtiene los asentamientos (colonias) y datos relacionados por código postal.
     */
    public function getSettlementsByZipCode(Request $request)
    {
        $zipCode = $request->input('zip_code');

        // Buscar los asentamientos por código postal con relaciones cargadas
        $settlements = Settlement::where('zip_code', $zipCode)
            ->with([
                'settlementType',
                'localidad' => function($query) {
                    $query->with([
                        'municipality' => function($query) {
                            $query->with('state');
                        }
                    ]);
                }
            ])
            ->get()
            ->map(function($settlement) {
                return [
                    'id' => $settlement->id,
                    'name' => $settlement->settlement_type . ' ' . $settlement->name, // Combine settlement type and name
                    'settlement_type' => $settlement->settlementType->name ?? '',
                    'settlement_name' => $settlement->name, // Added separate settlement name
                    'zip_code' => $settlement->zip_code,
                    'locality' => $settlement->localidad->name ?? '',
                    'municipality' => $settlement->localidad->municipality->name ?? '',
                    'state' => $settlement->localidad->municipality->state->name ?? ''
                ];
            });

        // Devolver los asentamientos y datos relacionados en formato JSON
        return response()->json($settlements);
    }
}