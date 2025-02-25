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



    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-white" id="successModalLabel">Registro Exitoso</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center py-4">
                    <div class="success-icon-container mb-4">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="confetti-left"></div>
                    <div class="confetti-right"></div>
                    <p id="successMessage" class="mb-0 fs-5">{{ session('success') }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success px-4" data-bs-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>
    </div>

    @if(session('success'))
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
</script>
@endif
@endsection
