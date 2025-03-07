// Global variables
let map;
let marker;
let geocoder;
let placesService;

function initMap() {
    const defaultCenter = { lat: 19.4326, lng: -99.1332 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        gestureHandling: 'greedy', 
        zoomControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
        },
        streetViewControl: false,
        fullscreenControl: false
    });
    
    geocoder = new google.maps.Geocoder();
    
    marker = new google.maps.Marker({
        position: defaultCenter,
        map: map,
        draggable: false 
    });
    
    // Initialize the Places service
    placesService = new google.maps.places.PlacesService(map);
}

function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true
        });
    }
}

function reverseGeocodeForStreets(location) {
    geocoder.geocode({ 'location': location }, function (results, status) {
        if (status === 'OK') {
            const streets = [];
            const currentStreet = $('#calle').val().toLowerCase();

            results.forEach(result => {
                result.address_components.forEach(component => {
                    if (component.types.includes('route')) {
                        const streetName = component.long_name;
                        if (streetName.toLowerCase() !== currentStreet) {
                            streets.push({
                                name: streetName,
                                vicinity: result.formatted_address
                            });
                        }
                    }
                });
            });

            // Eliminar duplicados
            const uniqueStreets = streets.filter((street, index, self) =>
                index === self.findIndex((s) => s.name === street.name)
            );

            // Actualizar los dropdowns de "Entre Calle 1" y "Entre Calle 2"
            updateStreetOptions(uniqueStreets);
        } else {
            console.log('Error en la geocodificación inversa:', status);
            updateStreetOptions([]); // Mostrar opciones vacías si no se encuentran calles
        }
    });
}

function updateAddressFields(result) {
    const components = result.address_components;
    let streetNumber = '';
    let street = '';
    let settlement = '';
    let municipality = '';
    let state = '';
    let postalCode = '';
    
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const types = component.types;
        
        if (types.includes('street_number')) {
            streetNumber = component.long_name;
        } else if (types.includes('route')) {
            street = component.long_name;
        } else if (types.includes('sublocality_level_1') || types.includes('locality')) {
            settlement = component.long_name;
        } else if (types.includes('administrative_area_level_2')) {
            municipality = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
        } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
        }
    }
    
    $('#codigo_postal').val(postalCode);
    $('#estado').val(state);
    $('#municipio').val(municipality);
    
    if (settlement) {
        let found = false;
        $('#colonia option').each(function() {
            if ($(this).text().includes(settlement)) {
                $(this).prop('selected', true);
                found = true;
                return false;
            }
        });
        
        if (!found && postalCode.length === 5) {
            $('#codigo_postal').trigger('input');
        }
    }
    
    $('#calle').val(street);
    $('#numero_exterior').val(streetNumber);
}

function searchAddress() {
    const postalCode = $('#codigo_postal').val();
    const state = $('#estado').val();
    const municipality = $('#municipio').val();
    const settlement = $('#colonia option:selected').text();
    const street = $('#calle').val();
    const streetNumber = $('#numero_exterior').val();

    let address = '';
    if (street) address += street + ' ';
    if (streetNumber) address += streetNumber + ', ';
    if (settlement) address += settlement + ', ';
    if (municipality) address += municipality + ', ';
    if (state) address += state + ', ';
    if (postalCode) address += postalCode + ', ';
    address += 'México';

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            placeMarker(results[0].geometry.location);

            // Obtener calles cercanas
            getNearbyStreets(results[0].geometry.location);
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function getNearbyStreets(location) {
    const request = {
        location: location,
        radius: 150, // Radio en metros
        type: ['route'], // Buscar rutas (calles)
        keyword: 'calle' // Palabra clave para mejorar los resultados
    };

    placesService.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            processStreets(results);
        } else {
            console.log('Error en la búsqueda de calles cercanas:', status);
            reverseGeocodeForStreets(location); // Intentar con geocodificación inversa
        }
    });
}

function reverseGeocodeForStreets(location) {
    geocoder.geocode({ 'location': location }, function(results, status) {
        if (status === 'OK') {
            // Extract streets from geocoding results
            const streets = [];
            const currentStreet = $('#calle').val().toLowerCase();
            
            // Process all address components looking for routes
            results.forEach(result => {
                result.address_components.forEach(component => {
                    if (component.types.includes('route')) {
                        const streetName = component.long_name;
                        if (streetName.toLowerCase() !== currentStreet) {
                            streets.push({
                                name: streetName,
                                vicinity: result.formatted_address
                            });
                        }
                    }
                });
                
                // Also check if the formatted address contains street names
                const formattedParts = result.formatted_address.split(',');
                formattedParts.forEach(part => {
                    if (part.toLowerCase().includes('calle') || 
                        part.toLowerCase().includes('avenida') || 
                        part.toLowerCase().includes('av.') ||
                        part.toLowerCase().includes('boulevard') ||
                        part.toLowerCase().includes('blvd')) {
                        
                        const streetName = part.trim();
                        if (streetName.toLowerCase() !== currentStreet) {
                            streets.push({
                                name: streetName,
                                vicinity: result.formatted_address
                            });
                        }
                    }
                });
            });
            
            // Use the unique streets found
            const uniqueStreets = streets.filter((street, index, self) =>
                index === self.findIndex((s) => s.name === street.name)
            );
            
            updateStreetOptions(uniqueStreets);
        } else {
            console.log('Reverse geocoding failed: ' + status);
            // If all else fails, show empty dropdowns
            updateStreetOptions([]);
        }
    });
}

function processStreets(results) {
    const streets = [];
    const currentStreet = $('#calle').val().toLowerCase();

    results.forEach(place => {
        if (place.name && place.name.toLowerCase() !== currentStreet) {
            streets.push({
                name: place.name,
                vicinity: place.vicinity || ''
            });
        }
    });

    // Eliminar duplicados
    const uniqueStreets = streets.filter((street, index, self) =>
        index === self.findIndex((s) => s.name === street.name)
    );

    // Actualizar los dropdowns de "Entre Calle 1" y "Entre Calle 2"
    updateStreetOptions(uniqueStreets);
}

function updateStreetOptions(streets) {
    const entreCalle1 = $('#entre_calle_1');
    const entreCalle2 = $('#entre_calle_2');

    // Limpiar opciones anteriores
    entreCalle1.empty();
    entreCalle2.empty();

    // Agregar opción por defecto
    entreCalle1.append('<option value="">Seleccione una calle</option>');
    entreCalle2.append('<option value="">Seleccione una calle</option>');

    if (streets.length === 0) {
        // Si no se encuentran calles, agregar una opción para ingresar manualmente
        entreCalle1.append('<option value="manual">Ingresar manualmente</option>');
        entreCalle2.append('<option value="manual">Ingresar manualmente</option>');
    } else {
        // Agregar las calles encontradas
        streets.forEach(street => {
            const optionText = street.vicinity ? `${street.name} (${street.vicinity})` : street.name;
            entreCalle1.append(`<option value="${street.name}">${optionText}</option>`);
            entreCalle2.append(`<option value="${street.name}">${optionText}</option>`);
        });

        // Agregar opción para ingresar manualmente
        entreCalle1.append('<option value="manual">Ingresar manualmente</option>');
        entreCalle2.append('<option value="manual">Ingresar manualmente</option>');
    }

    // Configurar la entrada manual de calles
    setupManualStreetEntry();
}

function setupManualStreetEntry() {
    $('#entre_calle_1, #entre_calle_2').change(function () {
        if ($(this).val() === 'manual') {
            const inputHtml = `
                <div class="manual-street-entry">
                    <input type="text" class="form-control manual-street-input" placeholder="Ingrese nombre de calle">
                    <button type="button" class="btn btn-sm btn-primary confirm-street"><i class="fas fa-check"></i></button>
                    <button type="button" class="btn btn-sm btn-secondary cancel-street"><i class="fas fa-times"></i></button>
                </div>
            `;
            $(this).hide().after(inputHtml);

            // Enfocar el nuevo input
            $(this).next('.manual-street-entry').find('input').focus();

            // Manejar el botón de confirmar
            $(this).next('.manual-street-entry').find('.confirm-street').click(function () {
                const manualValue = $(this).prev('input').val().trim();
                if (manualValue) {
                    $(this).parent().prev('select').append(`<option value="${manualValue}" selected>${manualValue}</option>`).val(manualValue).show();
                    $(this).parent().remove();
                }
            });

            // Manejar el botón de cancelar
            $(this).next('.manual-street-entry').find('.cancel-street').click(function () {
                $(this).parent().prev('select').val('').show();
                $(this).parent().remove();
            });
        }
    });
}

function setupManualStreetEntry() {
    // Handle manual entry for entre_calle_1
    $('#entre_calle_1').change(function() {
        if ($(this).val() === 'manual') {
            // Replace dropdown with text input
            const inputHtml = `
                <div class="manual-street-entry">
                    <input type="text" class="form-control manual-street-input" placeholder="Ingrese nombre de calle">
                    <button type="button" class="btn btn-sm btn-primary confirm-street"><i class="fas fa-check"></i></button>
                    <button type="button" class="btn btn-sm btn-secondary cancel-street"><i class="fas fa-times"></i></button>
                </div>
            `;
            $(this).hide().after(inputHtml);
            
            // Focus on the new input
            $(this).next('.manual-street-entry').find('input').focus();
            
            // Handle confirm button
            $(this).next('.manual-street-entry').find('.confirm-street').click(function() {
                const manualValue = $(this).prev('input').val().trim();
                if (manualValue) {
                    // Add the manual value to the dropdown
                    const newOption = `<option value="${manualValue}" selected>${manualValue}</option>`;
                    $('#entre_calle_1').append(newOption).val(manualValue).show().change();
                    $(this).parent('.manual-street-entry').remove();
                }
            });
            
            // Handle cancel button
            $(this).next('.manual-street-entry').find('.cancel-street').click(function() {
                $('#entre_calle_1').val('').show();
                $(this).parent('.manual-street-entry').remove();
            });
        }
    });
    
    // Handle manual entry for entre_calle_2
    $('#entre_calle_2').change(function() {
        if ($(this).val() === 'manual') {
            // Replace dropdown with text input
            const inputHtml = `
                <div class="manual-street-entry">
                    <input type="text" class="form-control manual-street-input" placeholder="Ingrese nombre de calle">
                    <button type="button" class="btn btn-sm btn-primary confirm-street"><i class="fas fa-check"></i></button>
                    <button type="button" class="btn btn-sm btn-secondary cancel-street"><i class="fas fa-times"></i></button>
                </div>
            `;
            $(this).hide().after(inputHtml);
            
            // Focus on the new input
            $(this).next('.manual-street-entry').find('input').focus();
            
            // Handle confirm button
            $(this).next('.manual-street-entry').find('.confirm-street').click(function() {
                const manualValue = $(this).prev('input').val().trim();
                if (manualValue) {
                    // Add the manual value to the dropdown
                    const newOption = `<option value="${manualValue}" selected>${manualValue}</option>`;
                    $('#entre_calle_2').append(newOption).val(manualValue).show().change();
                    $(this).parent('.manual-street-entry').remove();
                }
            });
            
            // Handle cancel button
            $(this).next('.manual-street-entry').find('.cancel-street').click(function() {
                $('#entre_calle_2').val('').show();
                $(this).parent('.manual-street-entry').remove();
            });
        }
    });
}

$(document).ready(function () {
    window.initMap = initMap;
    
    let currentSection = 1;
    
    // Update progress bar
    function updateProgressBar(section) {
        $('.progress-step').removeClass('active');
        $(`.progress-step:nth-child(${section})`).addClass('active');
    }

    $('.btn-next').click(function () {
        if (currentSection === 1) {
            $('#section-1').hide();
            $('#section-2').show();
            $('.btn-prev').show();
            $('.btn-next').show();
            $('.btn-submit').hide();
            currentSection = 2;
            updateProgressBar(2);
            
            if (map) {
                google.maps.event.trigger(map, 'resize');
            }
        } else if (currentSection === 2) {
            $('#section-2').hide();
            $('#section-3').show();
            $('.btn-prev').show();
            $('.btn-next').hide();
            $('.btn-submit').show();
            currentSection = 3;
            updateProgressBar(3);
        }
    });

    $('.btn-prev').click(function () {
        if (currentSection === 2) {
            $('#section-2').hide();
            $('#section-1').show();
            $('.btn-prev').hide();
            $('.btn-next').show();
            $('.btn-submit').hide();
            currentSection = 1;
            updateProgressBar(1);
        } else if (currentSection === 3) {
            $('#section-3').hide();
            $('#section-2').show();
            $('.btn-prev').show();
            $('.btn-next').show();
            $('.btn-submit').hide();
            currentSection = 2;
            updateProgressBar(2);
            
            if (map) {
                google.maps.event.trigger(map, 'resize');
            }
        }
    });

    $('#sector').change(function () {
        var sectorId = $(this).val();

        $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');

        if (sectorId) {
            $.get('/economic-activities/' + sectorId, function (data) {
                $.each(data, function (index, activity) {
                    $('#actividad_comercial').append('<option value="' + activity.id + '">' + activity.name + '</option>');
                });
            });
        }
    });

    $('form').on('keydown', function (event) {
        if (event.key === 'Enter' && !$(event.target).is('textarea')) {
            event.preventDefault();
            return false;
        }
    });

    $('#search-map-button').click(function(e) {
        e.preventDefault();
        searchAddress();
    });
    
    $('#codigo_postal').on('input', function() {
        var zipCode = $(this).val();
        
        $('#estado').val('');
        $('#municipio').val('');
        $('#colonia').html('<option value="">Seleccione un Asentamiento</option>');
        
        if (zipCode.length === 5) {
            $.ajax({
                url: '/settlements-by-zipcode',
                method: 'GET',
                data: {
                    zip_code: zipCode
                },
                success: function(data) {
                    console.log('Datos recibidos:', data);
                    if (data.length > 0) {
                        var firstSettlement = data[0];
                        
                        $('#estado').val(firstSettlement.state);
                        $('#municipio').val(firstSettlement.municipality);
                        
                        var coloniaSelect = $('#colonia');
                        coloniaSelect.empty();
                        
                        if (data.length === 1) {
                            coloniaSelect.append(
                                $('<option>', {
                                    value: firstSettlement.settlement_type + ' ' + firstSettlement.settlement_name,
                                    text: firstSettlement.settlement_type + ' ' + firstSettlement.settlement_name,
                                    selected: true
                                })
                            );
                        } else {
                            coloniaSelect.append(
                                $('<option>', {
                                    value: "",
                                    text: "Seleccione un Asentamiento"
                                })
                            );
                            
                            for (var i = 0; i < data.length; i++) {
                                var settlement = data[i];
                                coloniaSelect.append(
                                    $('<option>', {
                                        value: settlement.settlement_type + ' ' + settlement.settlement_name,
                                        text: settlement.settlement_type + ' ' + settlement.settlement_name
                                    })
                                );
                            }
                        }
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
    
    // Event handlers for address fields to trigger map update
    $('#colonia').on('change', function() {
        if ($('#codigo_postal').val().length === 5) {
            searchAddress();
        }
    });
    
    $('#calle').on('change', function() {
        if ($('#codigo_postal').val().length === 5) {
            searchAddress();
        }
    });
    
    $('#numero_exterior').on('change', function() {
        if ($('#codigo_postal').val().length === 5 && $('#calle').val()) {
            searchAddress();
        }
    });
    
    // Setup the manual street entry functionality
    setupManualStreetEntry();
    
    // Add CSS for the manual street entry UI
    $('<style>', {
        text: `
            .manual-street-entry {
                display: flex;
                margin-top: 5px;
            }
            .manual-street-input {
                flex-grow: 1;
                margin-right: 5px;
            }
            .confirm-street, .cancel-street {
                padding: 0.25rem 0.5rem;
                margin-left: 5px;
            }
        `
    }).appendTo('head');
    
    // Manejo de archivos para la sección 3
    $('.custom-file-input').on('change', function() {
        var fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').html(fileName);
    });
    
    // Commercial activities selection functionality
    let actividadesSeleccionadas = [];

    $('#sector').change(function() {
        const sectorId = $(this).val();
        actividadesSeleccionadas = [];
        actualizarActividadesMostradas();

        if (sectorId) {
            $.ajax({
                url: `/api/actividades/${sectorId}`,
                type: 'GET',
                success: function(data) {
                    let options = '<option value="">Seleccione una actividad</option>';
                    data.forEach(function(actividad) {
                        options += `<option value="${actividad.id}" data-nombre="${actividad.name}">${actividad.name}</option>`;
                    });
                    $('#actividad_comercial').html(options);
                }
            });
        } else {
            $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');
        }
    });

    $('#actividad_comercial').change(function() {
        const actividadId = $(this).val();
        const actividadNombre = $(this).find('option:selected').text();

        if (actividadId && actividadNombre && actividadNombre !== 'Seleccione una actividad') {
            if (!actividadesSeleccionadas.some(act => act.id === actividadId)) {
                actividadesSeleccionadas.push({ id: actividadId, nombre: actividadNombre });
                actualizarActividadesMostradas();
                $(this).val('');
            }
        }
    });

    function actualizarActividadesMostradas() {
        const container = $('#actividades_seleccionadas');
        container.empty();

        if (actividadesSeleccionadas.length === 0) {
            container.html('<div class="empty-message">No hay actividades seleccionadas</div>');
        } else {
            actividadesSeleccionadas.forEach(function(actividad) {
                container.append(`
                    <div class="actividad-item" data-id="${actividad.id}">
                        <span class="actividad-nombre">${actividad.nombre}</span>
                        <span class="eliminar"><i class="fas fa-times"></i></span>
                    </div>
                `);
            });
        }

        $('#actividades_comerciales_input').val(JSON.stringify(actividadesSeleccionadas.map(act => act.id)));
    }

    $(document).on('click', '.actividad-item .eliminar', function(e) {
        e.stopPropagation();
        const item = $(this).closest('.actividad-item');
        const actividadId = item.data('id');
        const idToRemove = typeof actividadId === 'string' ? parseInt(actividadId, 10) : actividadId;

        item.addClass('removing');
        actividadesSeleccionadas = actividadesSeleccionadas.filter(act => act.id !== idToRemove && act.id !== actividadId.toString());
        $('#actividades_comerciales_input').val(JSON.stringify(actividadesSeleccionadas.map(act => act.id)));

        setTimeout(function() {
            actualizarActividadesMostradas();
        }, 280);
    });

    actualizarActividadesMostradas();

    $(document).ready(function () {
        window.initMap = initMap;
    
        // Event listeners para actualizar el mapa y las calles
        $('#codigo_postal, #colonia, #calle, #numero_exterior').on('change', function () {
            if ($('#codigo_postal').val().length === 5 && $('#calle').val()) {
                searchAddress();
            }
        });
    
        $('#search-map-button').click(function (e) {
            e.preventDefault();
            searchAddress();
        });
    });
});