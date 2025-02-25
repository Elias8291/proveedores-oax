@extends('dashboard')
@section('title', 'Inicio - Panel Administrativo')
@section('content')
<style>
    .welcome-card {
        background: linear-gradient(to right, #f8f9fa, #f1f5f9);
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .welcome-card:hover {
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        transform: translateY(-5px);
    }
    
    .welcome-card h2 {
        font-weight: 700;
        color: #0d6efd;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 10px;
    }
    
    .list-group-item {
        border-left: none;
        border-right: none;
        padding: 15px 20px;
        transition: background-color 0.2s;
    }
    
    .list-group-item:hover {
        background-color: #f8f9fa;
    }
    
    .list-group-item i {
        width: 24px;
        text-align: center;
    }
    
    .btn {
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 500;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: all 0.3s;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .btn-success {
        background-color: #198754;
        border-color: #198754;
    }
    
    .btn-warning {
        background-color: #ffc107;
        border-color: #ffc107;
        color: #212529;
    }
    
    .btn-info {
        background-color: #0dcaf0;
        border-color: #0dcaf0;
        color: #fff;
    }
    
    @media (max-width: 768px) {
        .welcome-card {
            padding: 15px !important;
        }
        
        .btn {
            display: block;
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>

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