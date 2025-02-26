<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonData extends Model
{
    use HasFactory;

    protected $table = 'person_data';

    protected $fillable = [
        'user_id', 
        'legal_person',
        'rfc',
        'curp',
        'business_name',
        'tradename',
        'web_page',
        'status',
        'activity_id',
        'classification_id',
        'address_id',
        'representative_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function isValid(): bool
    {
        return $this->legal_person && $this->rfc && $this->business_name;
    }

    public function updateLastLogin()
    {
        $this->last_login = now();
        $this->save();
    }
}