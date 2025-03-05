@extends('dashboard')
@section('title', 'Formulario de Trámites')
@section('content')
    <div class="container">
        <div class="form-container">
            <!-- Header Section -->
            <div class="form-header">
                <h1 class="form-title">Registro de Trámites</h1>
                <p class="form-subtitle">Complete el formulario con la información solicitada para procesar su trámite de
                    manera eficiente</p>
            </div>

            <!-- Progress Tracker -->
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

            <!-- Form Content -->
            <div class="form-content">
                <form action="#" method="POST">
                    @csrf <!-- Token CSRF para protección -->

                    <!-- Sección 1: Datos Generales y Contacto -->
                    <div id="section-1" class="form-section">
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
                            <input type="text" id="curp" name="curp" class="form-control"
                                placeholder="Ej: ABCD123456HDFXYZ01" maxlength="18">
                        </div>

                        <!-- Datos de Contacto -->
                        <h2 class="section-title">
                            <i class="fas fa-address-card"></i>
                            Datos de Contacto
                        </h2>
                        <div class="form-group">
                            <label class="form-label" for="contacto_nombre">Nombre Completo</label>
                            <input type="text" id="contacto_nombre" name="contacto_nombre" class="form-control"
                                placeholder="Ej: Juan Pérez González">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contacto_cargo">Cargo o Puesto</label>
                            <input type="text" id="contacto_cargo" name="contacto_cargo" class="form-control"
                                placeholder="Ej: Director General">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contacto_telefono">Teléfono de Contacto</label>
                            <input type="tel" id="contacto_telefono" name="contacto_telefono" class="form-control"
                                placeholder="Ej: (951) 145 45 25">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contacto_correo">Correo Electrónico</label>
                            <input type="email" id="contacto_correo" name="contacto_correo" class="form-control"
                                placeholder="Ej: contacto@empresa.com">
                        </div>
                    </div>

                    <!-- Sección 2: Domicilio y Mapa -->
                    <div id="section-2" class="form-section" style="display: none;">
                        <h2 class="section-title">
                            <i class="fas fa-map-marker-alt"></i>
                            Domicilio
                        </h2>
                        <!-- Código Postal -->
                        <div class="form-group">
                            <label class="form-label" for="codigo_postal">Código Postal</label>
                            <input type="text" id="codigo_postal" name="codigo_postal" class="form-control"
                                placeholder="Ej: 68000">
                        </div>
                        <!-- Estado -->
                        <div class="form-group">
                            <label class="form-label" for="estado">Estado</label>
                            <input type="text" id="estado" name="estado" class="form-control"
                                placeholder="Ej: Oaxaca">
                        </div>
                        <!-- Municipio -->
                        <div class="form-group">
                            <label class="form-label" for="municipio">Municipio</label>
                            <input type="text" id="municipio" name="municipio" class="form-control"
                                placeholder="Ej: Oaxaca de Juárez">
                        </div>
                        <!-- Colonia -->
                        <div class="form-group">
                            <label class="form-label" for="colonia">Asentamiento</label>
                            <select id="colonia" name="colonia" class="form-control">
                                <option value="">Seleccione un Asentamiento</option>
                            </select>
                        </div>
                        <!-- Calle -->
                        <div class="form-group">
                            <label class="form-label" for="calle">Calle</label>
                            <input type="text" id="calle" name="calle" class="form-control"
                                placeholder="Ej: Av. Principal">
                        </div>
                        <!-- Número -->
                        <div class="form-group">
                            <label class="form-label" for="numero">Número</label>
                            <input type="text" id="numero" name="numero" class="form-control"
                                placeholder="Ej: 123">
                        </div>

                        <!-- Mapa -->
                        <div class="form-group">
                            <label class="form-label">Ubicación en el Mapa</label>
                            <div id="map" style="height: 300px; width: 100%;"></div>
                        </div>
                    </div>

                    <!-- Form Navigation -->
                    <div class="form-navigation">
                        <button type="button" class="btn-prev" style="display: none;">Anterior</button>
                        <button type="button" class="btn-next">Siguiente</button>
                        <button type="submit" class="btn-submit" style="display: none;">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts para manejar la navegación entre secciones -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
        $(document).ready(function() {
            // Navegación entre secciones
            let currentSection = 1;

            $('.btn-next').click(function() {
                if (currentSection === 1) {
                    $('#section-1').hide();
                    $('#section-2').show();
                    $('.btn-prev').show();
                    $('.btn-next').hide();
                    $('.btn-submit').show();
                    currentSection = 2;
                }
            });

            $('.btn-prev').click(function() {
                if (currentSection === 2) {
                    $('#section-2').hide();
                    $('#section-1').show();
                    $('.btn-prev').hide();
                    $('.btn-next').show();
                    $('.btn-submit').hide();
                    currentSection = 1;
                }
            });
        });
    </script>

    <!-- Incluir la API de Google Maps -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUqfgNQ2Q4AVy8OTNMfogJceDbA0FHZKs&callback=initMap" async
        defer></script>

    <!-- Script para inicializar el mapa -->
    <script>
        $(document).ready(function() {
            // Dynamic loading of commercial activities based on selected sector
            $('#sector').change(function() {
                var sectorId = $(this).val();

                $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');

                if (sectorId) {
                    $.get('/economic-activities/' + sectorId, function(data) {
                        $.each(data, function(index, activity) {
                            $('#actividad_comercial').append('<option value="' + activity
                                .id + '">' + activity.name + '</option>');
                        });
                    });
                }
            });
        });
        $(document).ready(function() {
    // Load settlements dynamically based on the entered ZIP code
    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();
        $('#colonia').html('<option value="">Seleccione una colonia</option>');

        if (zipCode.length === 5) {
            $.get('/settlements-by-zipcode', { zip_code: zipCode }, function(data) {
                $.each(data, function(index, settlement) {
                    $('#colonia').append('<option value="' + settlement.id + '">' + settlement.name + '</option>');
                });
            });
        }
    });
});

$(document).ready(function() {
    // Auto-fill state, municipality, and settlements based on ZIP code
    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();
        $('#estado').val('');
        $('#municipio').val('');
        $('#colonia').html('<option value="">Seleccione un asentamiento</option>');

        if (zipCode.length === 5) {
            $.ajax({
                url: '/settlements-by-zipcode',
                method: 'GET',
                data: { zip_code: zipCode },
                success: function(data) {
                    console.log('Datos recibidos:', data);
                    if (data.length > 0) {
                        $('#estado').val(data[0].state);
                        $('#municipio').val(data[0].municipality);
                        var coloniaSelect = $('#colonia');
                        coloniaSelect.empty().append('<option value="">Seleccione un Asentamiento</option>');
                        data.forEach(function(settlement) {
                            coloniaSelect.append(
                                $('<option>', {
                                    value: settlement.settlement_type + ' ' + settlement.settlement_name,
                                    text: settlement.settlement_type + ' ' + settlement.settlement_name
                                })
                            );
                        });
                    } else {
                        console.log('No se encontraron resultados para este código postal');
                        alert('No se encontraron resultados para este código postal');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error en la solicitud AJAX:', status, error, xhr.responseText);
                    alert('Error al buscar información: ' + error + '\nPor favor, revise la consola para más detalles');
                }
            });
        }
    });
});

$(document).ready(function() {
    // Load states and dynamically update municipalities and settlements
    $.get('/states', function(states) {
        var estadoSelect = $('#estado');
        estadoSelect.empty().append('<option value="">Seleccione un Estado</option>');
        states.forEach(function(state) {
            estadoSelect.append($('<option>', { value: state.id, text: state.name }));
        });
    });

    $('#estado').change(function() {
        var stateId = $(this).val();
        var municipioSelect = $('#municipio');
        municipioSelect.html('<option value="">Seleccione un Municipio</option>');
        $('#colonia').html('<option value="">Seleccione un Asentamiento</option>');

        if (stateId) {
            $.get('/municipalities-by-state/' + stateId, function(municipalities) {
                municipalities.forEach(function(municipality) {
                    municipioSelect.append($('<option>', { value: municipality.id, text: municipality.name }));
                });
            });
        }
    });

    $('#municipio').change(function() {
        var municipioId = $(this).val();
        var coloniaSelect = $('#colonia');
        coloniaSelect.html('<option value="">Seleccione un Asentamiento</option>');

        if (municipioId) {
            $.get('/localidades-by-municipality/' + municipioId, function(localidades) {
                localidades.forEach(function(localidad) {
                    $.get('/settlements-by-localidad/' + localidad.id, function(settlements) {
                        settlements.forEach(function(settlement) {
                            coloniaSelect.append($('<option>', { value: settlement.id, text: settlement.name }));
                        });
                    });
                });
            });
        }
    });

    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();
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
                        $('#estado option').each(function() {
                            if ($(this).text().trim() === data[0].state) {
                                $(this).prop('selected', true);
                                $('#estado').trigger('change');
                            }
                        });

                        var municipioSelect = $('#municipio');
                        var coloniaSelect = $('#colonia');
                        municipioSelect.empty().append('<option value="">Seleccione un Municipio</option>');
                        coloniaSelect.empty().append('<option value="">Seleccione un Asentamiento</option>');

                        data.forEach(function(settlement) {
                            if (municipioSelect.find('option[value="' + settlement.municipality + '"]').length === 0) {
                                municipioSelect.append($('<option>', { value: settlement.municipality, text: settlement.municipality }));
                            }
                            coloniaSelect.append($('<option>', { value: settlement.id, text: settlement.name }));
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

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUqfgNQ2Q4AVy8OTNMfogJceDbA0FHZKs&callback=initMap" async defer></script>

<script>
    function initMap() {
        var initialLocation = { lat: 19.4326, lng: -99.1332 };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: initialLocation
        });

        var marker = new google.maps.Marker({
            position: initialLocation,
            map: map,
            title: 'Initial location'
        });

        map.addListener('click', function(event) {
            marker.setPosition(event.latLng);
            console.log('Latitude:', event.latLng.lat());
            console.log('Longitude:', event.latLng.lng());
        });
    }

    $(document).ready(function() {
        function getFullAddress() {
            var calle = $('#calle').val().trim();
            var numero = $('#numero').val().trim();
            var colonia = $('#colonia option:selected').text().trim();
            var municipio = $('#municipio').val().trim();
            var estado = $('#estado option:selected').text().trim();
            var codigoPostal = $('#codigo_postal').val().trim();

            return `${calle} ${numero}, ${colonia}, ${municipio}, ${estado}, ${codigoPostal}, Mexico`;
        }

        $('#numero').on('blur', function() {
            if ($('#calle').val() && $('#numero').val() && $('#colonia').val() && 
                $('#municipio').val() && $('#estado').val() && $('#codigo_postal').val()) {
                var fullAddress = getFullAddress();
                searchAddressOnMap(fullAddress);
            }
        });

        function searchAddressOnMap(address) {
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                console.error('Google Maps API not loaded');
                return;
            }

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 16,
                        center: results[0].geometry.location
                    });

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: address,
                        draggable: true
                    });

                    var infowindow = new google.maps.InfoWindow({
                        content: `<strong>Address:</strong> ${address}`
                    });

                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });

                    console.log('Location found:', results[0].geometry.location.lat(), results[0].geometry.location.lng());

                    $('#latitude').val(results[0].geometry.location.lat());
                    $('#longitude').val(results[0].geometry.location.lng());
                } else {
                    console.warn('Address not found: ' + status);
                    initMap();
                }
            });
        }
    });
</script>

@endsection
