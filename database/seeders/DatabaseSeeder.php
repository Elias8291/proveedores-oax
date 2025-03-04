<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Http\Controllers\EconomicSectorController;
use Illuminate\Database\Seeder;
use Database\Seeders\CountrySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EconomicSectorSeeder::class,
            EconomicActivitiesSeeder::class,
            CountrySeeder::class,
            StatesTableSeeder::class,
            MunicipalitiesJsonSeeder::class,
            LocalitiesJsonSeeder::class,
            SettlementTypesSeeder::class,
            SettlementsSeeder::class,
        ]);
    }
}
