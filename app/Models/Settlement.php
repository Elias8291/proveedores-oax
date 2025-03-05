<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settlement extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'zip_code', 'localidad_id', 'settlement_type_id'];

    public function localidad()
    {
        return $this->belongsTo(Localidad::class, 'localidad_id', 'id');
    }

    public function settlementType()
    {
        return $this->belongsTo(SettlementType::class);
    }
}