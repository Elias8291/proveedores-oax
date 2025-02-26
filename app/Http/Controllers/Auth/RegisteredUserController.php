<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PersonData;
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
use Illuminate\Support\Facades\DB;

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
                'tipo_persona' => ['required', 'string', 'in:fisica,moral'],
                'razon_social' => ['required', 'string', 'max:255'],
                'rfc' => ['required', 'string', 'max:13', 'unique:person_data,rfc'],
            ]);

            $username = $this->generateUniqueUsername($request->name, $request->last_name);
            $password = $this->generateRandomPassword();

            DB::beginTransaction();

            try {
                $user = new User([
                    'name' => $request->name,
                    'last_name' => $request->last_name,
                    'second_last_name' => $request->second_last_name,
                    'email' => $request->email,
                    'username' => $username,
                    'password' => Hash::make($password),
                    'plain_password' => $password,
                ]);

                if (!$user->isValid()) {
                    throw new \Exception('El usuario no es válido.');
                }

                $personData = new PersonData([
                    'user_id' => $user->id,
                    'legal_person' => $request->tipo_persona,
                    'rfc' => $request->rfc,
                    'business_name' => $request->razon_social,
                    'status' => 'pendiente',
                ]);

                if (!$personData->isValid()) {
                    throw new \Exception('Los datos de la persona no son válidos.');
                }

                $user->save();
                $personData->user_id = $user->id;
                $personData->save();

                DB::commit();

                $this->sendCredentialsEmail($user, $username, $password);

                event(new Registered($user));

                return redirect()->route('welcome')->with('success', 'Su nombre de usuario y contraseña han sido enviados al correo ' . $user->email . '. Revise su cuenta.');
            } catch (\Exception $e) {
                DB::rollBack();
                return redirect()
                    ->back()
                    ->withErrors(['error' => 'Hubo un problema al registrar los datos. Por favor, inténtelo de nuevo.'])
                    ->withInput()
                    ->with('register_tab', true);
            }
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

    // Modify username generation to follow the requested pattern
    private function generateUniqueUsername($firstName, $lastName)
    {
        
        $firstNamePart = strtoupper(substr($firstName, 0, 2));
        $lastNamePart = strtoupper(substr($lastName, 0, 2));
        $number = rand(100, 999);

        $baseUsername = $firstNamePart . $lastNamePart . $number;
        $username = $baseUsername;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $extraNumber = rand(1000, 9999); 
            $extraLetter = $this->generateRandomString(1); 
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
    public function checkRFCExists(Request $request)
    {
        $rfc = $request->input('rfc');
        $exists = PersonData::where('rfc', $rfc)->exists();
        return response()->json(['exists' => $exists]);
    }
}
