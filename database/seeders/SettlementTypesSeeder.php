<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettlementTypesSeeder extends Seeder
{
    public function run()
    {
        // Los tipos de asentamiento que quieres agregar a la base de datos
        $settlementTypes = [
            'Colonia',
            'Fraccionamiento',
            'Condominio',
            'Unidad habitacional',
            'Barrio',
            'Equipamiento',
            'Zona comercial',
            'Rancho',
            'Ranchería',
            'Zona industrial',
            'Granja',
            'Pueblo',
            'Ejido',
            'Aeropuerto',
            'Paraje',
            'Hacienda',
            'Conjunto habitacional',
            'Zona militar',
            'Puerto',
            'Zona federal',
            'Exhacienda',
            'Finca',
            'Campamento',
            'Zona naval'
        ];

        // Insertar los datos en la tabla 'settlement_types'
        foreach ($settlementTypes as $type) {
            DB::table('settlement_types')->insert([
                'name' => $type,          // Insertamos el nombre del tipo de asentamiento
                'created_at' => now(),    // Establecemos created_at
                'updated_at' => now(),    // Establecemos updated_at
            ]);
        }
    }
}
