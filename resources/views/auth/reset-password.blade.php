@extends('layouts.app')

@section('content')
    <div class="main-container d-flex justify-content-center align-items-center vh-100">
        <div class="login-container card shadow-lg border-0 rounded-lg p-4" style="max-width: 400px; width: 100%; background-color: #f8f9fa;">
            
            <div class="login-header text-center mb-4">
                <img src="{{ asset('assets/images/logo_p.png') }}" alt="Logo" class="mb-3" style="max-width: 290px;">
                <h2 class="h4 font-weight-bold">Restablecer Contraseña</h2>
                <p class="text-muted">Introduce tu nuevo correo electrónico y contraseña.</p>
            </div>

            <form method="POST" action="{{ route('password.store') }}">
                @csrf

                <input type="hidden" name="token" value="{{ $request->route('token') }}">

                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <x-text-input id="email" class="form-control" type="email" name="email" :value="old('email', $request->email)" required autofocus autocomplete="username" />
                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Nueva Contraseña</label>
                    <x-text-input id="password" class="form-control" type="password" name="password" required autocomplete="new-password" />
                    <x-input-error :messages="$errors->get('password')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <label for="password_confirmation" class="form-label">Confirmar Contraseña</label>
                    <x-text-input id="password_confirmation" class="form-control" type="password" name="password_confirmation" required autocomplete="new-password" />
                    <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <button type="submit" class="btn btn-primary w-100 py-2">Restablecer Contraseña</button>
                </div>
            </form>

            <div class="text-center mt-4">
                <a href="{{ route('welcome') }}" class="btn btn-link text-muted w-100">Regresar a Inicio de Sesión</a>
            </div>
        </div>
    </div>
@endsection
