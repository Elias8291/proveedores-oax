<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MunicipalitiesJsonSeeder extends Seeder
{
    public function run()
    {
        // Ruta del archivo JSON
        $jsonPath = public_path('json/municipalities.json');

        if (File::exists($jsonPath)) {
            // Obtener el contenido del archivo JSON
            $jsonData = File::get($jsonPath);
            
            // Convertir el JSON en un arreglo
            $municipalities = json_decode($jsonData, true);

            // Verifica si el JSON fue decodificado correctamente
            if ($municipalities === null) {
                $this->command->error('Error al decodificar el JSON.');
                return;
            }

            // Verifica el contenido del JSON para asegurarse de que tiene la estructura esperada
            $this->command->info('Contenido del JSON:');
            $this->command->info(print_r($municipalities, true));

            // Insertar los datos en la base de datos
            foreach ($municipalities[0] as $municipality) {  // Accedemos a la primera capa del arreglo
                // Verifica si 'state_id' está presente
                if (!isset($municipality['state_id'])) {
                    $this->command->error('Falta la clave "state_id" en el municipio: ' . print_r($municipality, true));
                    continue;  // Salta al siguiente municipio si falta 'state_id'
                }

                DB::table('municipalities')->insert([
                    'state_id' => $municipality['state_id'],  // Insertamos 'state_id' desde el JSON
                    'name' => $municipality['name'],          // Insertamos 'name' desde el JSON
                    'created_at' => now(),                    // Establecemos created_at
                    'updated_at' => now(),                    // Establecemos updated_at
                ]);
            }
        } else {
            // Si el archivo JSON no existe, muestra un mensaje de error
            $this->command->error('El archivo JSON no se encuentra en la ruta: ' . $jsonPath);
        }
    }
}
