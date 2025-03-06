    let map;
    let marker;
    let geocoder;

    function initMap() {
        const defaultCenter = { lat: 19.4326, lng: -99.1332 };
        
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: defaultCenter,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        geocoder = new google.maps.Geocoder();
        
        marker = new google.maps.Marker({
            position: defaultCenter,
            map: map,
            draggable: true
        });
        
        google.maps.event.addListener(marker, 'dragend', function() {
            const position = marker.getPosition();
            map.setCenter(position);
            reverseGeocode(position);
        });
        
        google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
            reverseGeocode(event.latLng);
        });
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

    function reverseGeocode(latlng) {
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    updateAddressFields(results[0]);
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
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
        $('#numero').val(streetNumber);
    }

    function searchAddress() {
        const postalCode = $('#codigo_postal').val();
        const state = $('#estado').val();
        const municipality = $('#municipio').val();
        const settlement = $('#colonia option:selected').text();
        const street = $('#calle').val();
        const streetNumber = $('#numero').val();
        
        let address = '';
        if (street) address += street + ' ';
        if (streetNumber) address += streetNumber + ', ';
        if (settlement) address += settlement + ', ';
        if (municipality) address += municipality + ', ';
        if (state) address += state + ', ';
        if (postalCode) address += postalCode + ', ';
        address += 'México';
        
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                placeMarker(results[0].geometry.location);
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    $(document).ready(function () {
        window.initMap = initMap;
        
        let currentSection = 1;
        
        // Actualizar la barra de progreso
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
                                        value: firstSettlement.settlement_type + ' ' + firstSettlement.settlement_name,
                                        text: firstSettlement.settlement_type + ' ' + firstSettlement.settlement_name,
                                        selected: true
                                    })
                                );
                                
                                for (var i = 1; i < data.length; i++) {
                                    var settlement = data[i];
                                    coloniaSelect.append(
                                        $('<option>', {
                                            value: settlement.settlement_type + ' ' + settlement.settlement_name,
                                            text: settlement.settlement_type + ' ' + settlement.settlement_name
                                        })
                                    );
                                }
                            }
                            
                            searchAddress();
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
        
        $('#calle, #numero').on('change', function() {
            if ($('#codigo_postal').val().length === 5) {
                searchAddress();
            }
        });
        
        $('#colonia').on('change', function() {
            if ($('#codigo_postal').val().length === 5 && $('#calle').val()) {
                searchAddress();
            }
        });
        
        // Manejo de archivos para la sección 3
        $('.custom-file-input').on('change', function() {
            var fileName = $(this).val().split('\\').pop();
            $(this).next('.custom-file-label').html(fileName);
        });
        
    });