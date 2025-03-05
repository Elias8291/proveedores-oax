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
                    @csrf <!-- Token CSRF para protección -->
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

                                <!-- Sector -->
                                <div class="form-group custom-select">
                                    <label class="form-label" for="sector">Sector al que Pertenece</label>
                                    <select id="sector" name="sector" class="form-control">
                                        <option value="">Seleccione un sector</option>
                                        @foreach ($sectors as $sector)
                                            <option value="{{ $sector->id }}">{{ $sector->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Actividad Comercial -->
                                <div class="form-group">
                                    <label class="form-label" for="actividad_comercial">Actividad Comercial</label>
                                    <select id="actividad_comercial" name="actividad_comercial" class="form-control">
                                        <option value="">Seleccione una actividad</option>
                                    </select>
                                </div>

                                <!-- CURP -->
                                <div class="form-group">
                                    <label class="form-label" for="curp">CURP (Solo si es persona física)</label>
                                    <input type="text" id="curp" name="curp" class="form-control" placeholder="Ej: ABCD123456HDFXYZ01" maxlength="18">
                                </div>
                            </div>

                            <!-- Domicilio -->
                            <div class="form-section">
                                <h2 class="section-title">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Domicilio
                                </h2>
                                <!-- Código Postal -->
                                <div class="form-group">
                                    <label class="form-label" for="codigo_postal">Código Postal</label>
                                    <input type="text" id="codigo_postal" name="codigo_postal" class="form-control" placeholder="Ej: 68000">
                                </div>
                                <!-- Estado -->
                                <div class="form-group">
                                    <label class="form-label" for="estado">Estado</label>
                                    <input type="text" id="estado" name="estado" class="form-control" placeholder="Ej: Oaxaca">
                                </div>
                                <!-- Municipio -->
                                <div class="form-group">
                                    <label class="form-label" for="municipio">Municipio</label>
                                    <input type="text" id="municipio" name="municipio" class="form-control" placeholder="Ej: Oaxaca de Juárez">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="colonia">Asentamiento</label>
                                    <select id="colonia" name="colonia" class="form-control">
                                        <option value="">Seleccione un Asentamiento</option>
                                    </select>
                                </div>
                                <!-- Calle -->
                                <div class="form-group">
                                    <label class="form-label" for="calle">Calle</label>
                                    <input type="text" id="calle" name="calle" class="form-control" placeholder="Ej: Av. Principal">
                                </div>
                                <!-- Número -->
                                <div class="form-group">
                                    <label class="form-label" for="numero">Número</label>
                                    <input type="text" id="numero" name="numero" class="form-control" placeholder="Ej: 123">
                                </div>
                            </div>
                        </div>

                        <!-- Columna Derecha -->
                        <div class="form-column">
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

    <!-- Script para cargar dinámicamente las actividades económicas -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
        $(document).ready(function() {
            // Escuchar cambios en el dropdown de sectores
            $('#sector').change(function() {
                var sectorId = $(this).val();

                // Limpiar el dropdown de actividades
                $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');

                if (sectorId) {
                    // Hacer una solicitud AJAX para obtener las actividades del sector
                    $.get('/economic-activities/' + sectorId, function(data) {
                        // Llenar el dropdown de actividades con los datos recibidos
                        $.each(data, function(index, activity) {
                            $('#actividad_comercial').append('<option value="' + activity.id + '">' + activity.name + '</option>');
                        });
                    });
                }
            });
        });

        $(document).ready(function() {
        // Escuchar cambios en el campo de código postal
        $('#codigo_postal').on('input', function() {
            var zipCode = $(this).val();

            // Limpiar el dropdown de colonias
            $('#colonia').html('<option value="">Seleccione una colonia</option>');

            if (zipCode.length === 5) { // Asegurarse de que el código postal tenga 5 dígitos
                // Hacer una solicitud AJAX para obtener las colonias
                $.get('/settlements-by-zipcode', { zip_code: zipCode }, function(data) {
                    // Llenar el dropdown de colonias con los datos recibidos
                    $.each(data, function(index, settlement) {
                        $('#colonia').append('<option value="' + settlement.id + '">' + settlement.name + '</option>');
                    });
                });
            }
        });
    });

    $(document).ready(function() {
    // Escuchar cambios en el campo de código postal
    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();

        // Limpiar los campos de estado, municipio y colonia
        $('#estado').val('');
        $('#municipio').val('');
        $('#colonia').html('<option value="">Seleccione un asentamiento</option>');

        if (zipCode.length === 5) { // Asegurarse de que el código postal tenga 5 dígitos
            // Hacer una solicitud AJAX para obtener la información detallada del código postal
            $.ajax({
                url: '/settlements-by-zipcode', // Asegúrate de que esta ruta sea correcta
                method: 'GET',
                data: { zip_code: zipCode },
                success: function(data) {
                    console.log('Datos recibidos:', data); // Registro de datos para depuración
                    
                    if (data.length > 0) {
                        // Poblar estado (usar el primer resultado, asumiendo que son del mismo estado)
                        $('#estado').val(data[0].state);
                        
                        // Poblar municipio (usar el primer resultado, asumiendo que son del mismo municipio)
                        $('#municipio').val(data[0].municipality);
                        
                        // Poblar dropdown de colonias
                        var coloniaSelect = $('#colonia');
                        coloniaSelect.empty().append('<option value="">Seleccione un Asentamiento</option>');
                        
                        // Agregar cada colonia como una opción
                        data.forEach(function(settlement) {
                            coloniaSelect.append(
                                $('<option>', {
                                    value: settlement.settlement_type + ' ' + settlement.settlement_name,
                                    text: settlement.settlement_type + ' ' + settlement.settlement_name
                                })
                            );
                        });
                    } else {
                        // Manejar caso donde no se encuentran resultados
                        console.log('No se encontraron resultados para este código postal');
                        alert('No se encontraron resultados para este código postal');
                    }
                },
                error: function(xhr, status, error) {
                    // Registro detallado del error
                    console.error('Error en la solicitud AJAX:');
                    console.error('Estado:', status);
                    console.error('Error:', error);
                    console.error('Respuesta completa:', xhr.responseText);

                    // Mensaje de error más detallado
                    alert('Error al buscar información: ' + error + 
                          '\nPor favor, revise la consola para más detalles');
                }
            });
        }
    });
});


$(document).ready(function() {
    // Cargar estados al iniciar
    $.get('/states', function(states) {
        var estadoSelect = $('#estado');
        estadoSelect.empty().append('<option value="">Seleccione un Estado</option>');
        states.forEach(function(state) {
            estadoSelect.append(
                $('<option>', {
                    value: state.id,
                    text: state.name
                })
            );
        });
    });

    // Escuchar cambios en el selector de estados
    $('#estado').change(function() {
        var stateId = $(this).val();
        var municipioSelect = $('#municipio');

        // Limpiar y reiniciar selectores dependientes
        municipioSelect.html('<option value="">Seleccione un Municipio</option>');
        $('#colonia').html('<option value="">Seleccione un Asentamiento</option>');
        
        if (stateId) {
            // Cargar municipios del estado seleccionado
            $.get('/municipalities-by-state/' + stateId, function(municipalities) {
                municipalities.forEach(function(municipality) {
                    municipioSelect.append(
                        $('<option>', {
                            value: municipality.id,
                            text: municipality.name
                        })
                    );
                });
            });
        }
    });

    // Escuchar cambios en el selector de municipios
    $('#municipio').change(function() {
        var municipioId = $(this).val();
        var coloniaSelect = $('#colonia');

        // Limpiar selector de asentamientos
        coloniaSelect.html('<option value="">Seleccione un Asentamiento</option>');
        
        if (municipioId) {
            // Cargar localidades del municipio seleccionado
            $.get('/localidades-by-municipality/' + municipioId, function(localidades) {
                localidades.forEach(function(localidad) {
                    // Obtener asentamientos para cada localidad
                    $.get('/settlements-by-localidad/' + localidad.id, function(settlements) {
                        settlements.forEach(function(settlement) {
                            coloniaSelect.append(
                                $('<option>', {
                                    value: settlement.id,
                                    text: settlement.name
                                })
                            );
                        });
                    });
                });
            });
        }
    });

    // Mantener el código postal existente para búsqueda automática
    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();

        // Limpiar campos
        $('#estado').val('');
        $('#municipio').html('<option value="">Seleccione un Municipio</option>');
        $('#colonia').html('<option value="">Seleccione un Asentamiento</option>');

        if (zipCode.length === 5) {
            $.ajax({
                url: '/settlements-by-zipcode', 
                method: 'GET',
                data: { zip_code: zipCode },
                success: function(data) {
                    if (data.length > 0) {
                        // Encontrar y seleccionar el estado automáticamente
                        $('#estado option').each(function() {
                            if ($(this).text().trim() === data[0].state) {
                                $(this).prop('selected', true);
                                $('#estado').trigger('change');
                            }
                        });
                        
                        // Poblar municipios y asentamientos
                        var municipioSelect = $('#municipio');
                        var coloniaSelect = $('#colonia');
                        
                        municipioSelect.empty().append('<option value="">Seleccione un Municipio</option>');
                        coloniaSelect.empty().append('<option value="">Seleccione un Asentamiento</option>');
                        
                        data.forEach(function(settlement) {
                            // Agregar municipios únicos
                            if (municipioSelect.find('option[value="' + settlement.municipality + '"]').length === 0) {
                                municipioSelect.append(
                                    $('<option>', {
                                        value: settlement.municipality,
                                        text: settlement.municipality
                                    })
                                );
                            }
                            
                            // Agregar colonias
                            coloniaSelect.append(
                                $('<option>', {
                                    value: settlement.id,
                                    text: settlement.name
                                })
                            );
                        });
                    } else {
                        alert('No se encontraron resultados para este código postal');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error en la búsqueda:', error);
                    alert('No se pudo encontrar información para este código postal');
                }
            });
        }
    });
});
    </script>
@endsection