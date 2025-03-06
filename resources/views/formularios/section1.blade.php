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
                <select id="actividad_comercial" class="form-control">
                    <option value="">Seleccione una actividad</option>
                </select>
            </div>
            <div class="actividades-contenedor">
                <div class="actividades-header">
                    <i class="fas fa-list-check"></i> Actividades Seleccionadas
                </div>
                <div id="actividades_seleccionadas" class="actividades-lista">
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
            <div class="form-group">
                <label class="form-label" for="contacto_web">Página Web</label>
                <input type="url" id="contacto_web" name="contacto_web" class="form-control" placeholder="Ej: https://www.empresa.com">
            </div>
        </div>
    </div>
</div>

<style>
    .actividades-contenedor {
        margin-top: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        background-color: #fff;
        transition: box-shadow 0.3s ease;
    }
    .actividades-contenedor:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    .actividades-header {
        padding: 12px 15px;
        background-color: #f1f8ff;
        border-bottom: 1px solid #cce5ff;
        font-weight: 600;
        color: #0056b3;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
    }
    .actividades-header i {
        margin-right: 8px;
        color: #0056b3;
    }
    .actividades-lista {
        padding: 12px;
        min-height: 80px;
        max-height: 150px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-content: flex-start;
        background-color: #fafbfc;
    }
    .actividad-item {
        display: flex;
        align-items: center;
        background-color: #e9f4ff;
        border: 1px solid #b8daff;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 0.9rem;
        color: #0056b3;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .actividad-item:hover {
        background-color: #d4ebff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
    .empty-message {
        color: #6c757d;
        font-style: italic;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        padding: 10px;
    }
    #actividad_comercial {
        border: 1px solid #c1d7f0;
        padding: 10px 12px;
        border-radius: 6px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
    }
    #actividad_comercial:focus {
        border-color: #4c94eb;
        box-shadow: 0 0 0 3px rgba(76, 148, 235, 0.15);
    }
    .actividades-lista::-webkit-scrollbar {
        width: 8px;
    }
    .actividades-lista::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 10px;
    }
    .actividades-lista::-webkit-scrollbar-thumb {
        background: #c1d7f0;
        border-radius: 10px;
        transition: background 0.3s ease;
    }
    .actividades-lista::-webkit-scrollbar-thumb:hover {
        background: #4c94eb;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(5px); }
    }
    .actividad-item {
        animation: fadeIn 0.3s ease-out;
    }
    .actividad-item.removing {
        animation: fadeOut 0.3s ease-out;
        pointer-events: none;
    }
    font-size: 14px;
</style>

<script>
    $(document).ready(function() {
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
    });
</script>