

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


document.addEventListener('DOMContentLoaded', function() {
    // Get all file inputs
    const fileInputs = document.querySelectorAll('.file-upload-input');
    
    // Handle file selection for each input
    fileInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            const fileId = this.id;
            const file = this.files[0];
            const nameDisplay = document.getElementById(`${fileId}_name`);
            const progressBar = this.parentElement.querySelector('.upload-progress-bar');
            const progressContainer = this.parentElement.querySelector('.upload-progress');
            const successIcon = this.parentElement.querySelector('.upload-success');
            const errorIcon = this.parentElement.querySelector('.upload-status');
            
            if (file) {
                // Display file name
                nameDisplay.textContent = file.name;
                nameDisplay.classList.add('active');
                
                // Show progress animation
                progressContainer.classList.add('active');
                
                // Simulate upload progress
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(interval);
                        
                        // After upload complete
                        setTimeout(() => {
                            progressContainer.classList.remove('active');
                            successIcon.style.display = 'block';
                            
                            // Add to uploaded files list
                            addToUploadedFiles(file.name, fileId);
                        }, 400);
                    } else {
                        width += 5;
                        progressBar.style.width = width + '%';
                    }
                }, 50);
            }
        });
    });
    
    // Handle file upload area
    const uploadButtons = document.querySelectorAll('.file-upload-button');
    uploadButtons.forEach(button => {
        button.addEventListener('dragover', function(event) {
            event.preventDefault();
            this.style.backgroundColor = '#e9edff';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        button.addEventListener('dragleave', function(event) {
            event.preventDefault();
            this.style.backgroundColor = '#f5f7ff';
            this.style.borderColor = '#ccd6f6';
        });
        
        button.addEventListener('drop', function(event) {
            event.preventDefault();
            this.style.backgroundColor = '#f5f7ff';
            this.style.borderColor = '#ccd6f6';
            
            // Trigger the hidden file input
            const input = this.parentElement.querySelector('.file-upload-input');
            const fileList = event.dataTransfer.files;
            
            if (fileList.length > 0) {
                input.files = fileList;
                
                // Manually trigger change event
                const changeEvent = new Event('change', { bubbles: true });
                input.dispatchEvent(changeEvent);
            }
        });
    });
    
    // Function to add file to the uploaded files list
    function addToUploadedFiles(filename, fileId) {
        const uploadedFilesList = document.querySelector('.uploaded-files-list');
        const noFilesMessage = document.querySelector('.no-files-message');
        
        // Remove no files message if it exists
        if (noFilesMessage) {
            noFilesMessage.style.display = 'none';
        }
        
        // Create file item element
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.dataset.fileId = fileId;
        
        fileItem.innerHTML = `
            <i class="fas fa-file-pdf uploaded-file-icon"></i>
            <div class="uploaded-file-name">${filename}</div>
            <div class="uploaded-file-actions">
                <button class="uploaded-file-action view" title="Ver archivo">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="uploaded-file-action delete" title="Eliminar archivo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Add event listener for delete button
        const deleteButton = fileItem.querySelector('.delete');
        deleteButton.addEventListener('click', function() {
            // Get the file input
            const input = document.getElementById(fileId);
            
            // Reset the file input
            input.value = '';
            
            // Reset UI
            const nameDisplay = document.getElementById(`${fileId}_name`);
            nameDisplay.textContent = '';
            nameDisplay.classList.remove('active');
            
            const successIcon = input.parentElement.querySelector('.upload-success');
            successIcon.style.display = 'none';
            
            // Remove file item with animation
            fileItem.classList.add('removing');
            setTimeout(() => {
                uploadedFilesList.removeChild(fileItem);
                
                // Show no files message if list is empty
                if (uploadedFilesList.children.length === 0 || 
                    (uploadedFilesList.children.length === 1 && uploadedFilesList.children[0].className === 'no-files-message')) {
                    noFilesMessage.style.display = 'block';
                }
            }, 300);
        });
        
        // Add file item to the list
        uploadedFilesList.appendChild(fileItem);
    }
});