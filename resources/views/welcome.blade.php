@extends('layouts.app')

@section('title', 'Inicio')

@section('content')
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="row justify-content-center w-100">
            <div class="col-12 col-md-6 col-lg-5 "> 
                <div class="auth-container">
                    <div class="auth-header text-center">
                        <img src="{{ asset('assets/images/logo_p.png') }}" alt="Logo" class="img-fluid mb-3" style="max-width: 260px;">
                        <h1 class="h4">Registro al Padrón de Proveedores</h1> 
                    </div>
                    <ul class="nav nav-tabs nav-justified mb-4" id="authTabs">
                        <li class="nav-item">
                            <a class="nav-link {{ session('register_tab') ? '' : 'active' }}" id="login-tab" data-bs-toggle="tab" href="#loginForm">Iniciar Sesión</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ session('register_tab') ? 'active' : '' }}" id="register-tab" data-bs-toggle="tab" href="#registerForm">Registrarse</a>
                        </li>
                    </ul>

                    <div class="tab-content" id="authTabsContent">
                        <div class="tab-pane fade {{ session('register_tab') ? '' : 'show active' }}" id="loginForm" role="tabpanel" aria-labelledby="login-tab">
                            @include('auth.login')
                        </div>
                        <div class="tab-pane fade {{ session('register_tab') ? 'show active' : '' }}" id="registerForm" role="tabpanel" aria-labelledby="register-tab">
                            @include('auth.register')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
