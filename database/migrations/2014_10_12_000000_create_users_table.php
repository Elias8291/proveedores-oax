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
use Illuminate\Support\Str;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    public function create(): View
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'first_lastname' => ['required', 'string', 'max:255'],
            'second_lastname' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'email_confirmation' => ['required', 'same:email'],
            'tipo_persona' => ['required', 'string', 'in:fisica,moral'],
            'razon_social' => ['required', 'string', 'max:255'],
            'rfc' => ['required', 'string', 'max:13'],
        ]);

        $username = $this->generateUniqueUsername($request->name, $request->first_lastname);
        $password = $this->generateRandomPassword();

        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->first_lastname,
            'second_last_name' => $request->second_lastname,
            'email' => $request->email,
            'username' => $username,
            'password' => Hash::make($password),
            'plain_password' => $password, // Store plain password temporarily for email
            'status' => 'Activo'
        ]);

        // Here you would typically send an email with the generated credentials
        // event(new UserRegistered($user)); // Create this event to handle email sending

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

    private function generateUniqueUsername($firstName, $lastName): string
    {
        $baseUsername = strtolower(Str::slug($firstName . '.' . $lastName));
        $username = $baseUsername;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        return $username;
    }

    private function generateRandomPassword(): string
    {
        return Str::random(12); 
    }
}