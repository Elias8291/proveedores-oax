$(document).ready(function () {
    let currentSection = 1;
    let selectedActivities = [];

    // Oculta todas las secciones excepto la 1 al inicio
    $('#section-2, #section-3, #section-4, #section-5, #section-6').hide();

    // Actualiza la barra de progreso
    function updateProgressBar(section) {
        $('.progress-step').removeClass('active');
        $(`.progress-step:nth-child(${section})`).addClass('active');
    }

    // Navega a una sección específica
    function navigateToSection(section) {
        // Oculta todas las secciones
        $('#section-1, #section-2, #section-3, #section-4, #section-5, #section-6').hide();

        // Muestra solo la sección actual
        $(`#section-${section}`).show();

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
        if (currentSection < 6) {
            currentSection++;
            updateProgressBar(currentSection);
            navigateToSection(currentSection);
        }
    });

    // Botón "Anterior"
    $('.btn-prev').click(function () {
        if (currentSection > 1) {
            currentSection--;
            updateProgressBar(currentSection);
            navigateToSection(currentSection);
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
});document.addEventListener("DOMContentLoaded", function () {
    // Selecciona todos los inputs de tipo file
    const fileInputs = document.querySelectorAll(".file-upload-input");

    fileInputs.forEach((input) => {
        input.addEventListener("change", function (e) {
            const file = e.target.files[0]; // Obtiene el archivo seleccionado
            const card = input.closest(".file-upload-card"); // Encuentra la tarjeta contenedora
            const stateIcon = card.querySelector(".file-status-icon");
            const stateText = card.querySelector(".file-status-text");

            if (file) {
                // Validación básica del tipo de archivo (PDF)
                if (file.type === "application/pdf") {
                    // Cambia el estado a "Subido"
                    stateIcon.classList.remove("pending");
                    stateIcon.classList.add("uploaded");
                    stateIcon.innerHTML = '<i class="fas fa-check"></i>';
                    stateText.textContent = "Subido";

                    // Añade una clase para resaltar la tarjeta
                    card.classList.add("upload-success");

                    // Muestra una animación de confirmación
                    card.style.animation = "fadeInUp 0.5s ease-out";

                    // Cambia el color del borde de la tarjeta
                    card.style.borderColor = "#28a745";

                    // Muestra un mensaje de éxito
                    setTimeout(() => {
                        alert(`Archivo "${file.name}" subido correctamente.`);
                    }, 500);
                } else {
                    // Muestra un mensaje de error si no es un PDF
                    alert("Solo se permiten archivos PDF.");
                    input.value = ""; // Limpia el input
                }
            } else {
                // Si no se selecciona un archivo, restablece el estado
                stateIcon.classList.remove("uploaded");
                stateIcon.classList.add("pending");
                stateIcon.innerHTML = '<i class="fas fa-clock"></i>';
                stateText.textContent = "Pendiente";
                card.classList.remove("upload-success");
                card.style.borderColor = "#e9ecef"; // Restablece el color del borde
            }
        });
    });
});
