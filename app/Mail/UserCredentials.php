<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Spatie\Permission\Traits\HasRoles;

class UserCredentials extends Mailable
{  use HasRoles;
    use Queueable, SerializesModels;

    public $user;
    public $username;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $username, $password)
    {
        $this->user = $user;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Sus credenciales de acceso',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'email.user_registered', 
        );
    }
}