<!-- resources/views/layouts/sidebar.blade.php -->

<div class="sidebar" id="sidebarMenu">
    <div class="nav flex-column">
        <a class="nav-link active" href="#">
            <i class="fas fa-home"></i>
            Inicio
        </a>
        <a class="nav-link" href="#">
            <i class="fas fa-users"></i>
            Ciudadanos
            <span class="badge badge-subtle ms-auto">14</span>
        </a>
        <a class="nav-link" href="{{ route('formulario1') }}">
            <i class="fas fa-file-alt"></i>
            Trámites
        </a>
        <a class="nav-link" href="#">
            <i class="fas fa-chart-line"></i>
            Estadísticas
        </a>
        <a class="nav-link" href="#">
            <i class="fas fa-calendar"></i>
            Agenda
        </a>
        <a class="nav-link" href="#">
            <i class="fas fa-cog"></i>
            Configuración
        </a>
    </div>
</div>