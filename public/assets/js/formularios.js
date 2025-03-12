

$(document).ready(function () {
    let currentSection = 1;
    let selectedActivities = [];

// Actualiza la barra de progreso
function updateProgressBar(section) {
    $('.progress-step').removeClass('active');
    $(`.progress-step:nth-child(${section})`).addClass('active');
}

function navigateToSection(section) {
    // Oculta o muestra las secciones según el número de sección
    $('#section-1').toggle(section === 1);
    $('#section-2').toggle(section === 2);
    $('#section-3').toggle(section === 3);
    $('#section-4').toggle(section === 4);
    $('#section-5').toggle(section === 5);
    $('#section-6').toggle(section === 6); // Nueva sección 6

    // Muestra u oculta los botones de navegación
    $('.btn-prev').toggle(section !== 1); // Mostrar "Anterior" si no es la sección 1
    $('.btn-next').toggle(section !== 6); // Mostrar "Siguiente" si no es la sección 6
    $('.btn-submit').toggle(section === 6); // Mostrar "Enviar" solo en la sección 6

    // Redimensiona el mapa si está en la sección 2 o 3
    if (window.map && (section === 2 || section === 3)) {
        google.maps.event.trigger(window.map, 'resize');
    }
}

// Botón "Siguiente"
$('.btn-next').click(function () {
    if (currentSection === 1) {
        currentSection = 2;
        updateProgressBar(2);
        navigateToSection(2);
    } else if (currentSection === 2) {
        currentSection = 3;
        updateProgressBar(3);
        navigateToSection(3);
    } else if (currentSection === 3) {
        currentSection = 4;
        updateProgressBar(4);
        navigateToSection(4);
    } else if (currentSection === 4) {
        currentSection = 5;
        updateProgressBar(5);
        navigateToSection(5);
    } else if (currentSection === 5) {
        currentSection = 6; // Navegar a la sección 6
        updateProgressBar(6);
        navigateToSection(6);
    }
});

// Botón "Anterior"
$('.btn-prev').click(function () {
    if (currentSection === 2) {
        currentSection = 1;
        updateProgressBar(1);
        navigateToSection(1);
    } else if (currentSection === 3) {
        currentSection = 2;
        updateProgressBar(2);
        navigateToSection(2);
    } else if (currentSection === 4) {
        currentSection = 3;
        updateProgressBar(3);
        navigateToSection(3);
    } else if (currentSection === 5) {
        currentSection = 4;
        updateProgressBar(4);
        navigateToSection(4);
    } else if (currentSection === 6) {
        currentSection = 5; // Regresar a la sección 5
        updateProgressBar(5);
        navigateToSection(5);
    }
});
    // Carga actividades comerciales según el sector seleccionado
    $('#sector').change(function () {
        const sectorId = $(this).val();
        $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');

        if (sectorId) {
            $.get('/economic-activities/' + sectorId, function (data) {
                data.forEach(activity => {
                    $('#actividad_comercial').append(`<option value="${activity.id}">${activity.name}</option>`);
                });
            });
        }
    });

    // Evita el envío del formulario al presionar "Enter"
    $('form').on('keydown', function (event) {
        if (event.key === 'Enter' && !$(event.target).is('textarea')) {
            event.preventDefault();
            return false;
        }
    });

    // Maneja el envío del formulario
    $('form').submit(function () {
        const entreCalle1 = $('#entre_calle_1').val();
        const entreCalle2 = $('#entre_calle_2').val();

        if ($('input[name="entre_calle_1"]').length === 0) {
            $(this).append(`<input type="hidden" name="entre_calle_1" value="${entreCalle1}">`);
        } else {
            $('input[name="entre_calle_1"]').val(entreCalle1);
        }

        if ($('input[name="entre_calle_2"]').length === 0) {
            $(this).append(`<input type="hidden" name="entre_calle_2" value="${entreCalle2}">`);
        } else {
            $('input[name="entre_calle_2"]').val(entreCalle2);
        }
    });

    // Carga actividades comerciales dinámicamente
    $('#sector').change(function () {
        const sectorId = $(this).val();
        selectedActivities = [];
        updateSelectedActivities();

        if (sectorId) {
            $.ajax({
                url: `/api/actividades/${sectorId}`,
                type: 'GET',
                success: function (data) {
                    let options = '<option value="">Seleccione una actividad</option>';
                    data.forEach(activity => {
                        options += `<option value="${activity.id}" data-nombre="${activity.name}">${activity.name}</option>`;
                    });
                    $('#actividad_comercial').html(options);
                }
            });
        }
    });

    // Agrega actividades seleccionadas
    $('#actividad_comercial').change(function () {
        const activityId = $(this).val();
        const activityName = $(this).find('option:selected').text();

        if (activityId && activityName && activityName !== 'Seleccione una actividad') {
            if (!selectedActivities.some(act => act.id === activityId)) {
                selectedActivities.push({ id: activityId, nombre: activityName });
                updateSelectedActivities();
                $(this).val('');
            }
        }
    });

    // Actualiza la lista de actividades seleccionadas
    function updateSelectedActivities() {
        const container = $('#actividades_seleccionadas');
        container.empty();

        if (selectedActivities.length === 0) {
            container.html('<div class="empty-message">No hay actividades seleccionadas</div>');
        } else {
            selectedActivities.forEach(activity => {
                container.append(`
                    <div class="actividad-item" data-id="${activity.id}">
                        <span class="actividad-nombre">${activity.nombre}</span>
                        <span class="eliminar"><i class="fas fa-times"></i></span>
                    </div>
                `);
            });
        }

        $('#actividades_comerciales_input').val(JSON.stringify(selectedActivities.map(act => act.id)));
    }

    // Elimina una actividad seleccionada
    $(document).on('click', '.actividad-item .eliminar', function (e) {
        e.stopPropagation();
        const item = $(this).closest('.actividad-item');
        const activityId = item.data('id');
        const idToRemove = typeof activityId === 'string' ? parseInt(activityId, 10) : activityId;

        item.addClass('removing');
        selectedActivities = selectedActivities.filter(act => act.id !== idToRemove && act.id !== activityId.toString());
        $('#actividades_comerciales_input').val(JSON.stringify(selectedActivities.map(act => act.id)));

        setTimeout(() => {
            updateSelectedActivities();
        }, 280);
    });

    $(document).ready(function () {
        // Inicializar contador de socios
        window.socioCounter = 0;
    
        // Función para agregar una nueva fila de socio
        function agregarFilaSocio() {
            window.socioCounter++;
            const newRow = `
                <tr id="socio-row-${window.socioCounter}">
                    <td>
                        <input type="text" name="socios[${window.socioCounter}][apellido_paterno]" class="form-control" placeholder="Apellido paterno" required>
                    </td>
                    <td>
                        <input type="text" name="socios[${window.socioCounter}][apellido_materno]" class="form-control" placeholder="Apellido materno">
                    </td>
                    <td>
                        <input type="text" name="socios[${window.socioCounter}][nombres]" class="form-control" placeholder="Nombre(s)" required>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center;">
                            <input type="text" name="socios[${window.socioCounter}][porcentaje]" class="form-control porcentaje-input" placeholder="Ej: 50" style="flex: 1; margin-right: 8px;">
                            <span class="porcentaje-simbolo">%</span>
                        </div>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm eliminar-socio">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            $('#tabla-socios tbody').append(newRow);
        }
    
        // Evento para agregar socio
        $('#agregar-socio').click(function () {
            agregarFilaSocio();
        });
    
        // Evento delegado para eliminar socio
        $('#tabla-socios').on('click', '.eliminar-socio', function () {
            $(this).closest('tr').remove();
        });
    });
    
    // Carga actividades comerciales según el sector seleccionado
    $('#sector').change(function () {
        const sectorId = $(this).val();
        $('#actividad_comercial').html('<option value="">Seleccione una actividad</option>');
        
        if (sectorId) {
            $.get('/economic-activities/' + sectorId, function (data) {
                data.forEach(activity => {
                    $('#actividad_comercial').append(`<option value="${activity.id}">${activity.name}</option>`);
                });
            });
        }
    });
    updateSelectedActivities();
});
