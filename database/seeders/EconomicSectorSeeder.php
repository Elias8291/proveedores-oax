<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class EconomicSectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Ruta al archivo JSON en la carpeta public/json
        $jsonPath = public_path('json/sectors.json');

        // Verificar si el archivo existe
        if (!File::exists($jsonPath)) {
            $this->command->error("El archivo JSON no existe en la ruta: {$jsonPath}");
            return;
        }

        // Leer el archivo JSON
        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        // Verificar si el JSON se decodificó correctamente
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("Error al decodificar el archivo JSON: " . json_last_error_msg());
            return;
        }

        // Iterar sobre los datos y insertarlos en la tabla
        foreach ($data['Hoja1'] as $sector) {
            DB::table('economic_sectors')->insert([
                'name' => $sector['sector'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Datos de sectores económicos insertados correctamente.');
    }
}