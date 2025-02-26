<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'last_name',
        'second_last_name',
        'username',
        'email',
        'password',
        'plain_password',
        'status',        
        'last_login',     
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login' => 'datetime', // Asegúrate de incluir last_login aquí
    ];

    public function getAuthIdentifierName()
    {
        return 'username';
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }

    public function isValid(): bool
    {
        return $this->name && $this->email && $this->username && $this->password;
    }

    public function updateLastLogin(): void
    {
        $this->last_login = now();
        $this->save();
    }
}
