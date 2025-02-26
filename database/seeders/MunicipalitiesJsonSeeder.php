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
            $municipalities = json_decode($jsonData, true);

            foreach ($municipalities as $municipality) {
                DB::table('municipalities')->insert([
                    'state_id' => $municipality['state_id'],
                    'name' => $municipality['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } else {
            $this->command->error('El archivo JSON no se encuentra en la ruta: ' . $jsonPath);
        }
    }
}
