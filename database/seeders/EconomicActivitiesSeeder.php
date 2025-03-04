<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class EconomicActivitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = public_path('json/activities.json'); 
        
        if (!File::exists($jsonPath)) {
            throw new \Exception("El archivo activities.json no se encuentra en public/json/");
        }
        
        $json = File::get($jsonPath);
        $data = json_decode($json, true);
        
        foreach ($data['Hoja1'] as $activity) {
            DB::table('economic_activities')->insert([
                'name' => $activity['actividad'],
                'sector_id' => $activity['id_sector'], 
            ]);
        }
    }
}
