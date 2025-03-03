<header class="header shadow-sm">
    <nav class="navbar navbar-expand-lg h-100">
        <div class="container-fluid h-100">
            <!-- Logo y toggler -->
            <button class="navbar-toggler border-0 text-guinda" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
                <i class="fas fa-bars"></i>
            </button>
            <a class="navbar-brand d-flex align-items-center" href="#">
                <!-- Logo con tamaño ajustado -->
                <img src="{{ asset('assets/images/logo_p.png') }}" alt="Logo" class="logo-img" style="max-height: 40px; width: auto;">
            </a>
            
            <!-- Opciones de usuario y notificaciones - visible solo en desktop -->
            <ul class="navbar-nav ms-auto align-items-center d-none d-lg-flex">
                <li class="nav-item me-3">
                    <a class="nav-link position-relative" href="#" title="Notificaciones">
                        <i class="fas fa-bell text-guinda"></i>
                        <span class="badge rounded-pill bg-guinda position-absolute top-0 start-100 translate-middle">3</span>
                    </a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link" href="#" title="Mi Perfil" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="user-avatar bg-guinda-light">
                            <span class="text-guinda">P</span>
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end animate-fade-in shadow-sm border-light">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2 text-guinda"></i>Mi perfil</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2 text-guinda"></i>Configuración</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="dropdown-item text-guinda">
                                    <i class="fas fa-sign-out-alt me-2"></i>Cerrar sesión
                                </button>
                            </form>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>