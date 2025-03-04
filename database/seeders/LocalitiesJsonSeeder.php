<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class LocalitiesJsonSeeder extends Seeder
{
    public function run()
    {
        $jsonPath = public_path('json/localities.json');

        if (File::exists($jsonPath)) {
            $jsonData = File::get($jsonPath);
            $data = json_decode($jsonData, true);

            if ($data === null) {
                $this->command->error('Error al decodificar el JSON.');
                return;
            }

            if (!isset($data['Sheet1']) || !is_array($data['Sheet1'])) {
                $this->command->error('La estructura del JSON no es la esperada. Se esperaba la clave "Sheet1".');
                return;
            }

            $this->command->info('Contenido del JSON:');
            $this->command->info(print_r($data['Sheet1'], true));

            foreach ($data['Sheet1'] as $locality) {
                if (!isset($locality['municipality_id'])) {
                    $this->command->error('Falta la clave "municipality_id" en la localidad: ' . print_r($locality, true));
                    continue;
                }

                // Verificar que el municipio exista en la base de datos
                $municipalityExists = DB::table('municipalities')
                    ->where('id', $locality['municipality_id'])
                    ->exists();

                if (!$municipalityExists) {
                    $this->command->error('El municipio con id ' . $locality['municipality_id'] . ' no existe en la tabla municipalities.');
                    continue;
                }

                DB::table('localidades')->insert([
                    'municipality_id' => $locality['municipality_id'],
                    'name'            => $locality['name'],
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        } else {
            $this->command->error('El archivo JSON no se encuentra en la ruta: ' . $jsonPath);
        }
    }
}
