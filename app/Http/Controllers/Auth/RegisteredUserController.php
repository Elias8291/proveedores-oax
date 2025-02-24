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
        try{
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

            return redirect(RouteServiceProvider::HOME);
        }
        catch (ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput()
                ->with('register_tab', true);  // This will ensure the register tab is active
        }
    }

    // Send email with credentials
    private function sendCredentialsEmail($user, $username, $password)
    {
        Mail::to($user->email)->send(new UserCredentials($user, $username, $password));
    }

    // Modify username generation to include letters and numbers
    private function generateUniqueUsername($firstName, $lastName)
    {
        $baseUsername = strtolower(Str::slug($firstName . '.' . $lastName));
        $username = $baseUsername . $this->generateRandomString(3); // Append 3 random characters
        $counter = 1;

        // Ensure the username is unique
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $this->generateRandomString(3) . $counter;
            $counter++;
        }

        return $username;
    }

    // Generate a random alphanumeric string (3 characters in this case)
    private function generateRandomString($length = 3)
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return substr(str_shuffle($characters), 0, $length);
    }

    // Generate a random password of 8 characters
    private function generateRandomPassword()
    {
        return Str::random(8); // Random password with 8 characters
    }
}