<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CredentialsEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $username;
    public $password;

    public function __construct($user, $username, $password)
    {
        $this->user = $user;
        $this->username = $username;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('Sus credenciales de acceso')
                    ->view('emails.credentials');
    }
}