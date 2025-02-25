<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\View\View;
use Illuminate\Validation\ValidationException;
use App\Mail\CredentialsEmail;
use App\Mail\UserCredentials;

class RegisteredUserController extends Controller
{
    public function create(): View
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'second_last_name' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'email_confirmation' => ['required', 'same:email'],
            ]);

            // Generate username and password
            $username = $this->generateUniqueUsername($request->name, $request->last_name);
            $password = $this->generateRandomPassword();

            // Save the user
            $user = User::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'second_last_name' => $request->second_last_name,
                'email' => $request->email,
                'username' => $username,
                'password' => Hash::make($password), // Save the encrypted password
                'plain_password' => $password, // Save the plain password
            ]);

            // Send credentials email
            $this->sendCredentialsEmail($user, $username, $password);

            event(new Registered($user));

            return redirect()->route('welcome')->with('success', 'Sus nombre de usaurio y contraseña han sido enviadas al correo ' . $user->email . '. Revise su cuenta.');
        } catch (ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('register_tab', true);  
        }
    }

    // Send email with credentials
    private function sendCredentialsEmail($user, $username, $password)
    {
        Mail::to($user->email)->send(new UserCredentials($user, $username, $password));
    }

    // Modify username generation to include letters and numbers
    // Modify username generation to follow the requested pattern
    private function generateUniqueUsername($firstName, $lastName)
    {
        // Obtener las dos primeras letras del nombre y apellido
        $firstNamePart = strtoupper(substr($firstName, 0, 2));
        $lastNamePart = strtoupper(substr($lastName, 0, 2));

        // Generar un número aleatorio de 3 dígitos
        $number = rand(100, 999);

        $baseUsername = $firstNamePart . $lastNamePart . $number;
        $username = $baseUsername;
        $counter = 1;

        // Verificar si el nombre de usuario ya existe
        while (User::where('username', $username)->exists()) {
            $extraNumber = rand(1000, 9999); // Ahora 4 dígitos en lugar de 3
            $extraLetter = $this->generateRandomString(1); // Agregar una letra aleatoria
            $username = $firstNamePart . $lastNamePart . $extraNumber . $extraLetter;
            $counter++;
        }

        return $username;
    }

    // Generar una letra aleatoria
    private function generateRandomString($length = 1)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return substr(str_shuffle($characters), 0, $length);
    }

    // Generate a random password of 8 characters
    private function generateRandomPassword()
    {
        return Str::random(8);
    }
}
