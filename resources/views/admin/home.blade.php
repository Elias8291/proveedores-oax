@extends('dashboard')
@section('title', 'Inicio - Panel Administrativo')
@section('content')

<div class="container mt-3">
    <div class="row mb-3">
        <div class="col-12">
            <div class="card shadow-sm border-0">
                <div class="card-body p-3 welcome-card">
                    <h2 class="text-primary">
                        ¡Bienvenido al Padrón de Proveedores, {{ Auth::user()->name }}!
                    </h2>
                    <p class="text-muted">
                        En este panel podrás gestionar de manera eficiente los trámites relacionados con el padrón de proveedores.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <!-- Tarjeta 1: Registro de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <h3>Registro de proveedores</h3>
                <p>Da de alta nuevos proveedores en el sistema.</p>
            </div>
        </div>

        <!-- Tarjeta 2: Renovación de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-sync-alt"></i>
                </div>
                <h3>Renovación de proveedores</h3>
                <p>Gestiona las renovaciones de proveedores existentes.</p>
            </div>
        </div>

        <!-- Tarjeta 3: Actualización de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-edit"></i>
                </div>
                <h3>Actualización de proveedores</h3>
                <p>Modifica y actualiza la información de proveedores.</p>
            </div>
        </div>

        <!-- Tarjeta 4: Consulta de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Consulta de proveedores</h3>
                <p>Busca y consulta información de proveedores registrados.</p>
            </div>
        </div>

        <!-- Tarjeta 5: Evaluación de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-star"></i>
                </div>
                <h3>Evaluación de proveedores</h3>
                <p>Califica y evalúa el desempeño de los proveedores.</p>
            </div>
        </div>

        <!-- Tarjeta 6: Reportes de proveedores -->
        <div class="col-md-4 mb-3">
            <div class="action-card">
                <div class="action-icon">
                    <i class="fas fa-chart-bar"></i>
                </div>
                <h3>Reportes de proveedores</h3>
                <p>Genera informes y estadísticas de los proveedores.</p>
            </div>
        </div>
    </div>
</div>

@endsection
