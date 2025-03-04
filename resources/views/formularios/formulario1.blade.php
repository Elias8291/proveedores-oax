@extends('dashboard')
@section('title', 'Formulario de Trámites')
@section('content')
    <div class="container">
        <div class="form-container">
            <!-- Header Section -->
            <div class="form-header">
                <h1 class="form-title">Registro de Trámites</h1>
                <p class="form-subtitle">Complete el formulario con la información solicitada para procesar su trámite de manera eficiente</p>
            </div>

            <!-- Progress Tracker -->
            <div class="progress-tracker">
                <div class="progress-step active">
                    <div class="step-indicator">
                        <span class="step-number">1</span>
                        <i class="step-icon fas fa-database"></i>
                    </div>
                    <div class="step-label">Datos Generales</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">2</span>
                        <i class="step-icon fas fa-user"></i>
                    </div>
                    <div class="step-label">Información de Contacto</div>
                </div>
                <div class="progress-step">
                    <div class="step-indicator">
                        <span class="step-number">3</span>
                        <i class="step-icon fas fa-check"></i>
                    </div>
                    <div class="step-label">Revisión y Confirmación</div>
                </div>
            </div>

            <!-- Form Content -->
            <div class="form-content">
                <form action="#" method="POST">
                    <!-- Layout de dos columnas -->
                    <div class="two-column-layout">
                        <!-- Columna Izquierda -->
                        <div class="form-column">
                            <!-- Datos Generales -->
                            <div class="form-section">
                                <h2 class="section-title">
                                    <i class="fas fa-building"></i>
                                    Datos Generales
                                </h2>
                                <div class="form-group">
                                    <label class="form-label" for="actividad_comercial">Actividad Comercial</label>
                                    <input type="text" id="actividad_comercial" name="actividad_comercial" class="form-control" placeholder="Ej: Servicios Profesionales">
                                </div>
                                <div class="form-group custom-select">
                                    <label class="form-label" for="sector">Sector al que Pertenece</label>
                                    <select id="sector" name="sector" class="form-control">
                                        <option value="">Seleccione un sector</option>
                                        <option value="tecnologia">Tecnología</option>
                                        <option value="salud">Salud</option>
                                        <option value="educacion">Educación</option>
                                        <option value="comercio">Comercio</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="curp">CURP (Solo si es persona física)</label>
                                    <input type="text" id="curp" name="curp" class="form-control" placeholder="Ej: ABCD123456HDFXYZ01" maxlength="18">
                                </div>
                            </div>

                            <!-- Datos de Contacto -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-address-card"></i>
                                    Datos de Contacto
                                </h3>
                                <div class="form-group">
                                    <label class="form-label" for="contacto_nombre">Nombre Completo</label>
                                    <input type="text" id="contacto_nombre" name="contacto_nombre" class="form-control" placeholder="Ej: Juan Pérez González">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="contacto_cargo">Cargo o Puesto</label>
                                    <input type="text" id="contacto_cargo" name="contacto_cargo" class="form-control" placeholder="Ej: Director General">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="contacto_telefono">Teléfono de Contacto</label>
                                    <input type="tel" id="contacto_telefono" name="contacto_telefono" class="form-control" placeholder="Ej: (951) 145 45 25">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="contacto_correo">Correo Electrónico</label>
                                    <input type="email" id="contacto_correo" name="contacto_correo" class="form-control" placeholder="Ej: contacto@empresa.com">
                                </div>
                            </div>
                        </div>

                        <!-- Columna Derecha -->
                        <div class="form-column">
                            <!-- Domicilio -->
                            <div class="form-section">
                                <h2 class="section-title">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Domicilio
                                </h2>
                                <div class="form-group">
                                    <label class="form-label" for="calle">Calle</label>
                                    <input type="text" id="calle" name="calle" class="form-control" placeholder="Ej: Av. Principal">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="numero">Número</label>
                                    <input type="text" id="numero" name="numero" class="form-control" placeholder="Ej: 123">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="colonia">Colonia</label>
                                    <input type="text" id="colonia" name="colonia" class="form-control" placeholder="Ej: Centro">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="codigo_postal">Código Postal</label>
                                    <input type="text" id="codigo_postal" name="codigo_postal" class="form-control" placeholder="Ej: 68000">
                                </div>
                            </div>

                            <!-- Ubicación en Mapa -->
                            <div class="form-section">
                                <div class="form-group">
                                    <label class="form-label">Ubicación en el Mapa</label>
                                    <div id="map" style="height: 300px; width: 100%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form Navigation -->
                    <div class="form-navigation">
                        <button type="button" class="btn-next">Siguiente</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection