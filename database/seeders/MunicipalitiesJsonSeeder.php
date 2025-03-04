<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MunicipalitiesJsonSeeder extends Seeder
{
    public function run()
    {
        $jsonPath = public_path('json/municipalities.json');

        if (File::exists($jsonPath)) {
            $jsonData = File::get($jsonPath);
            $data = json_decode($jsonData, true);

            if ($data === null) {
                $this->command->error('Error al decodificar el JSON.');
                return;
            }

            $this->command->info('Contenido del JSON:');
            $this->command->info(print_r($data, true));

            if (!isset($data['Sheet1'])) {
                $this->command->error('La clave "Sheet1" no se encuentra en el JSON.');
                return;
            }

            // Reiniciar el contador de auto-incremento a 1
            DB::statement('ALTER TABLE municipalities AUTO_INCREMENT = 1;');

            foreach ($data['Sheet1'] as $municipality) {
                if (!isset($municipality['state_id'])) {
                    $this->command->error('Falta la clave "state_id" en el municipio: ' . print_r($municipality, true));
                    continue;
                }

                DB::table('municipalities')->insert([
                    'state_id'   => $municipality['state_id'],
                    'name'       => $municipality['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } else {
            $this->command->error('El archivo JSON no se encuentra en la ruta: ' . $jsonPath);
        }
    }
}