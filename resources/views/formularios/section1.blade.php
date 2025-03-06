<!-- Sección 1: Datos Generales y Contacto -->
<div id="section-1" class="form-section">
    <div class="row">
        <div class="col-md-6">
            <h2 class="section-title">
                <i class="fas fa-building"></i>
                Datos Generales
            </h2>
            <div class="form-group custom-select">
                <label class="form-label" for="sector">Sector al que Pertenece</label>
                <select id="sector" name="sector" class="form-control">
                    <option value="">Seleccione un sector</option>
                    @foreach ($sectors as $sector)
                        <option value="{{ $sector->id }}">{{ $sector->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label" for="actividad_comercial">Actividades Comerciales</label>
                <div class="input-group">
                    <select id="actividad_comercial" class="form-control">
                        <option value="">Seleccione una actividad</option>
                    </select>
                    <div class="input-group-append">
                        <button type="button" id="agregar_actividad" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Contenedor distintivo para actividades seleccionadas -->
            <div class="actividades-contenedor">
                <div class="actividades-header">
                    <i class="fas fa-list-check"></i> Actividades Seleccionadas
                </div>
                <div id="actividades_seleccionadas" class="actividades-lista">
                    <!-- Las actividades seleccionadas aparecerán aquí -->
                    <div class="empty-message">No hay actividades seleccionadas</div>
                </div>
                <input type="hidden" name="actividades_comerciales" id="actividades_comerciales_input">
            </div>
            
            <div class="form-group mt-3">
                <label class="form-label" for="curp">CURP (Solo si es persona física)</label>
                <input type="text" id="curp" name="curp" class="form-control" placeholder="Ej: ABCD123456HDFXYZ01" maxlength="18">
            </div>
        </div>
        <div class="col-md-6">
            <h2 class="section-title">
                <i class="fas fa-address-card"></i>
                Datos de Contacto
            </h2>
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
</div>


<script>
$(document).ready(function() {
    // Array para almacenar las actividades seleccionadas
    let actividadesSeleccionadas = [];
    
    // Evento para cargar actividades comerciales según el sector seleccionado
    $('#sector').change(function() {
        const sectorId = $(this).val();
        
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
    
    // Agregar actividad al hacer clic en el botón o presionar Enter en el select
    $('#agregar_actividad').click(agregarActividad);
    $('#actividad_comercial').on('keydown', function(e) {
        if (e.keyCode === 13) { // Enter key
            e.preventDefault();
            agregarActividad();
        }
    });
    
    function agregarActividad() {
        const selectElement = $('#actividad_comercial');
        const actividadId = selectElement.val();
        const actividadNombre = selectElement.find('option:selected').text();
        
        if (actividadId && actividadNombre && actividadNombre !== 'Seleccione una actividad') {
            // Verificar si ya está en la lista
            if (!actividadesSeleccionadas.some(act => act.id === actividadId)) {
                // Agregar al array
                actividadesSeleccionadas.push({
                    id: actividadId,
                    nombre: actividadNombre
                });
                
                // Actualizar la visualización
                actualizarActividadesMostradas();
                
                // Limpiar la selección
                selectElement.val('').focus();
            }
        }
    }
    
    // Función para actualizar las actividades mostradas
    function actualizarActividadesMostradas() {
        const container = $('#actividades_seleccionadas');
        container.empty();
        
        if (actividadesSeleccionadas.length === 0) {
            container.html('<div class="empty-message">No hay actividades seleccionadas</div>');
        } else {
            actividadesSeleccionadas.forEach(function(actividad) {
                container.append(`
                    <div class="actividad-item" data-id="${actividad.id}">
                        ${actividad.nombre}
                        <span class="eliminar">×</span>
                    </div>
                `);
            });
        }
        
        // Actualizar el campo oculto para enviar con el formulario
        $('#actividades_comerciales_input').val(JSON.stringify(actividadesSeleccionadas.map(act => act.id)));
    }
    
    // Delegación de eventos para eliminar actividades
    $(document).on('click', '.actividad-item .eliminar', function() {
        const actividadId = $(this).parent().data('id');
        actividadesSeleccionadas = actividadesSeleccionadas.filter(act => act.id !== actividadId);
        actualizarActividadesMostradas();
    });
    
    // Inicializar la visualización
    actualizarActividadesMostradas();
});
</script>