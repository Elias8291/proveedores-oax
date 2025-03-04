<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettlementTypesSeeder extends Seeder
{
    public function run()
    {
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

        foreach ($settlementTypes as $type) {
            DB::table('settlement_types')->insert([
                'name' => $type,         
                'created_at' => now(),   
                'updated_at' => now(),  
            ]);
        }
    }
}
