<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class LocalitiesJsonSeeder extends Seeder
{
    public function run()
    {
        // Ruta del archivo JSON
        $jsonPath = public_path('json/localities.json');

        if (File::exists($jsonPath)) {
            // Obtener el contenido del archivo JSON
            $jsonData = File::get($jsonPath);
            
            // Convertir el JSON en un arreglo
            $localities = json_decode($jsonData, true);

            // Verifica si el JSON fue decodificado correctamente
            if ($localities === null) {
                $this->command->error('Error al decodificar el JSON.');
                return;
            }

            // Verifica el contenido del JSON para asegurarse de que tiene la estructura esperada
            $this->command->info('Contenido del JSON:');
            $this->command->info(print_r($localities, true));

            // Insertar los datos en la base de datos
            foreach ($localities[0] as $locality) {  // Accedemos a la primera capa del arreglo
                // Verifica si 'municipality_id' está presente
                if (!isset($locality['municipality_id'])) {
                    $this->command->error('Falta la clave "municipality_id" en la localidad: ' . print_r($locality, true));
                    continue;  // Salta al siguiente municipio si falta 'municipality_id'
                }

                DB::table('localidades')->insert([
                    'municipality_id' => $locality['municipality_id'],  // Insertamos 'municipality_id' desde el JSON
                    'name' => $locality['name'],          // Insertamos 'name' desde el JSON
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
