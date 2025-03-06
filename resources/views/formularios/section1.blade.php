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
