<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $username;
    public $password;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Bienvenido a la Página Web de Proveedores')
                    ->view('emails.welcome')
                    ->attach(public_path('images/logo.png'), [
                        'as' => 'logo.png',
                        'mime' => 'image/png',
                    ]);
    }
}