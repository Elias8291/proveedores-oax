@extends('layouts.app')

@section('content')
    <div class="main-container d-flex justify-content-center align-items-center vh-100">
        <div class="login-container card shadow-lg border-0 rounded-lg p-4"
            style="max-width: 400px; width: 100%; background-color: #f8f9fa;">
            
            @if (session('status'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {{ session('status') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <div class="login-header text-center mb-4">
                <img src="{{ asset('assets/images/logo_p.png') }}" alt="Logo" class="mb-3" style="max-width: 290px;">
                <h2 class="h4 font-weight-bold">Recuperación de Contraseña</h2>
                <p class="text-muted">Introduce tu correo electrónico y RFC para recibir un enlace de recuperación.</p>
            </div>

            <form method="POST" action="{{ route('password.email') }}">
                @csrf
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}"
                        required autofocus placeholder="tu@correo.com">
                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <label for="rfc" class="form-label">RFC</label>
                    <input type="text" class="form-control" id="rfc" name="rfc" value="{{ old('rfc') }}"
                        required placeholder="Ingresa tu RFC">
                    <x-input-error :messages="$errors->get('rfc')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <button type="submit" class="btn btn-primary w-100 py-2">Enviar Enlace de Recuperación</button>
                </div>
            </form>

            <div class="text-center mt-4">
                <a href="{{ route('welcome') }}" class="btn btn-link text-muted w-100">Regresar a Inicio de Sesión</a>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var alertElement = document.querySelector('.alert');
        if (alertElement) {
            setTimeout(function() {
                var bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }, 5000); 
        }
    });
</script>
@endpush