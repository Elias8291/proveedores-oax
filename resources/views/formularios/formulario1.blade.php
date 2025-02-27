@extends('dashboard')
@section('title', 'Formulario de Trámites')
@section('content')
    <div class="container">
        <div class="form-container">
            <h1>Formulario de Trámites</h1>
            
            <form action="#" method="POST">
                @csrf
                
                <div class="form-sections-container" style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div class="form-section" style="flex: 1; min-width: 300px;">
                        <h2>Datos Generales</h2>
                        
                        <div class="form-row">
                            <div class="form-group half">
                                <label for="actividad_comercial">Actividad Comercial</label>
                                <input type="text" id="actividad_comercial" name="actividad_comercial" class="form-control" placeholder="Ej: Servicios Profesionales">
                            </div>
                            
                            <div class="form-group half custom-select sector">
                                <label for="sector">Sector al que Pertenece</label>
                                <select id="sector" name="sector" class="form-control">
                                    <option value="">Seleccione un sector</option>
                                    <option value="tecnologia">Tecnología</option>
                                    <option value="salud">Salud</option>
                                    <option value="educacion">Educación</option>
                                    <option value="comercio">Comercio</option>
                                    <option value="servicios">Servicios</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="curp">CURP (Solo si es persona física)</label>
                            <input type="text" id="curp" name="curp" class="form-control" placeholder="Ej: ABCD123456HDFXYZ01" maxlength="18">
                        </div>
                    </div>
                    
                    <div class="form-section" style="flex: 1; min-width: 300px;">
                        <h2>Contacto</h2>
                        <p class="subtitle">Persona que recibirá requerimientos de información, solicitudes o invitaciones</p>
                        
                        <div class="form-row">
                            <div class="form-group half">
                                <label for="contacto_nombre">Nombre</label>
                                <input type="text" id="contacto_nombre" name="contacto_nombre" class="form-control" placeholder="Ej: Juan Pérez">
                            </div>
                            
                            <div class="form-group half">
                                <label for="contacto_cargo">Cargo</label>
                                <input type="text" id="contacto_cargo" name="contacto_cargo" class="form-control" placeholder="Ej: Gerente">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group half input-with-icon icon-phone">
                                <label for="contacto_telefono">Teléfono</label>
                                <input type="tel" id="contacto_telefono" name="contacto_telefono" class="form-control" placeholder="Ej: 951 172 94 30">
                            </div>
                            
                            <div class="form-group half input-with-icon icon-email">
                                <label for="contacto_correo">Correo Electrónico</label>
                                <input type="email" id="contacto_correo" name="contacto_correo" class="form-control" placeholder="Ej: contacto@correo.com">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="reset" class="btn-reset">Limpiar</button>
                    <button type="submit" class="btn-submit">Enviar Solicitud</button>
                </div>
            </form>
        </div>
    </div>
@endsection