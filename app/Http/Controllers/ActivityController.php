<?php


namespace App\Http\Controllers;

use App\Models\EconomicActivity;
use App\Models\EconomicSector;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
   
    public function getActivitiesBySector($sectorId)
    {
        $activities = EconomicActivity::where('sector_id', $sectorId)->get();
        return response()->json($activities);
    }
}
