<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Localidad extends Model
{
    use HasFactory;

    // Explicitly set the table name
    protected $table = 'localidades';

    protected $fillable = ['name', 'municipality_id'];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function settlements()
    {
        return $this->hasMany(Settlement::class, 'localidad_id', 'id');
    }
}