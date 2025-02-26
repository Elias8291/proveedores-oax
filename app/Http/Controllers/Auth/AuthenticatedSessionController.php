<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Models\User;


class AuthenticatedSessionController extends Controller
{
    public function create(): View
    {
        return view('auth.login');
    }

   public function store(LoginRequest $request): RedirectResponse
{
    $credentials = $request->only('username', 'password');

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        $user = Auth::user();
        $user->last_login = now(); // Set the current timestamp
        $user->save(); // Save the model to the database

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    $user = User::where('username', $request->username)->first();

    if (!$user) {
        return back()->withErrors([
            'username' => trans('auth.user_failed'),
        ])->withInput();
    }

    return back()->withErrors([
        'password' => trans('auth.password'),
    ])->withInput();
}
public function destroy(Request $request): RedirectResponse
{
    Auth::guard('web')->logout(); // Cierra la sesión del usuario

    $request->session()->invalidate(); // Invalida la sesión
    $request->session()->regenerateToken(); // Regenera el token de CSRF

    return redirect('/'); // Redirige al usuario a la página de inicio
}
}
