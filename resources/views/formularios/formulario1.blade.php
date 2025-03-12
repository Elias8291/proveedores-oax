@extends('dashboard')
@section('title', 'Formulario de Trámites')
@section('content')
    <div class="container">
        <div class="form-container">
            <div class="form-header">
                <h1 class="form-title">Registro de Trámites</h1>
                <p class="form-subtitle">Complete el formulario con la información solicitada para procesar su trámite de manera eficiente</p>
            </div>
            
            <!-- Barra de Progreso -->
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
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">3</span>
                        <i class="step-icon fas fa-file-contract"></i>
                    </div>
                    <div class="step-label">Datos de Constitución</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">4</span>
                        <i class="step-icon fas fa-users"></i>
                    </div>
                    <div class="step-label">Socios o Accionistas</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">5</span>
                        <i class="step-icon fas fa-user-tie"></i>
                    </div>
                    <div class="step-label">Datos del Apoderado</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">6</span>
                        <i class="step-icon fas fa-file-pdf"></i>
                    </div>
                    <div class="step-label">Documentación Requerida</div>
                </div>
            </div> 
            
            <!-- Contenido del Formulario -->
            <div class="form-content">
                <form action="#" method="POST">
                    @csrf
                    @include('formularios.section1') 
                    @include('formularios.section2') 
                    @include('formularios.section3')
                    @include('formularios.section4')
                    @include('formularios.section5')
                    @include('formularios.section6')

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