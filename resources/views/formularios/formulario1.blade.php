@extends('dashboard')
@section('title', 'Formulario de Trámites')
@section('content')
    <div class="container">
        <div class="form-container">
            <div class="form-header">
                <h1 class="form-title">Registro de Trámites</h1>
                <p class="form-subtitle">Complete el formulario con la información solicitada para procesar su trámite de manera eficiente</p>
            </div>

            <div class="progress-tracker">
                <div class="progress-step active">
                    <div class="step-indicator">
                        <span class="step-number">1</span>
                        <i class="step-icon fas fa-database"></i>
                    </div>
                    <div class="step-label">Datos Generales y Contacto</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">2</span>
                        <i class="step-icon fas fa-map-marker-alt"></i>
                    </div>
                    <div class="step-label">Domicilio y Ubicación</div>
                </div>
            </div>

            <div class="form-content">
                <form action="#" method="POST">
                    @csrf

                    @include('formularios.section1')
                    @include('formularios.section2')

                    <div class="form-navigation">
                        <button type="button" class="btn-prev btn-primary" style="display: none;">Anterior</button>
                        <button type="button" class="btn-next btn-primary">Siguiente</button>
                        <button type="submit" class="btn-submit btn-primary" style="display: none;">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

@endsection