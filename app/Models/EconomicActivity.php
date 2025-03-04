<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EconomicActivity extends Model
{
    use HasFactory;

    protected $fillable = ['sector_id', 'name'];

    public function sector()
    {
        return $this->belongsTo(EconomicSector::class);
    }
}