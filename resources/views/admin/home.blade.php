@extends('dashboard')
@section('title', 'Inicio - Panel Administrativo')
@section('content')

<div class="container mt-4">
    <div class="card shadow-sm border-0">
        <div class="card-body p-4 welcome-card">
            <h2 class="mb-3 text-primary">¡Bienvenido al Panel Administrativo, {{ $userName }}!</h2>
            <p class="text-muted">
                En este panel podrás gestionar de manera eficiente los trámites relacionados con el padrón de proveedores.
                Aquí puedes realizar las siguientes acciones:
            </p>
            <!-- Lista de acciones -->
            <ul class="list-group list-group-flush mb-4">
                <li class="list-group-item">
                    <i class="fas fa-user-plus me-2 text-success"></i>
                    <strong>Registro de Proveedores:</strong> Agrega nuevos proveedores al padrón.
                </li>
                <li class="list-group-item">
                    <i class="fas fa-sync-alt me-2 text-warning"></i>
                    <strong>Renovación de Proveedores:</strong> Actualiza la vigencia de los proveedores existentes.
                </li>
                <li class="list-group-item">
                    <i class="fas fa-edit me-2 text-info"></i>
                    <strong>Actualización de Datos:</strong> Modifica la información de los proveedores registrados.
                </li>
            </ul>
            <!-- Botones de acción -->
            
        </div>
    </div>
</div>
@endsection