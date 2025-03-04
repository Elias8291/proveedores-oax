<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SettlementsSeeder extends Seeder
{
    public function run()
    {
        // Ruta al archivo JSON
        $jsonPath = public_path('json/settlements.json');

        // Verificar si el archivo existe
        if (File::exists($jsonPath)) {
            // Leer el archivo JSON
            $jsonData = File::get($jsonPath);
            $data = json_decode($jsonData, true);

            // Verificar si el JSON se decodificó correctamente
            if ($data === null) {
                $this->command->error('Error al decodificar el JSON.');
                return;
            }

            // Insertar datos en la tabla settlements
            foreach ($data['settlements'] as $settlement) {
                DB::table('settlements')->insert([
                    'name' => $settlement['name'],
                    'zip_code' => $settlement['zip_code'],
                    'localidad_id' => $settlement['localidad_id'],
                    'settlement_type_id' => $settlement['settlement_type_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $this->command->info('Datos de settlements insertados correctamente.');
        } else {
            $this->command->error('El archivo JSON no se encuentra en la ruta: ' . $jsonPath);
        }
    }
}