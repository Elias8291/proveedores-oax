<form method="POST" action="{{ route('register') }}">
    @csrf

    <div id="section1" class="position-relative pb-5">
        <!-- Rejilla de 2 columnas para primera sección -->
        <div class="row">
            <!-- Fila 1: Nombre y Primer Apellido -->
            <div class="col-md-6">
                <div class="floating-input">
                    <label for="name" class="form-label">Nombre(s) *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i> 
                        </span>
                        <input type="text" class="form-control" id="name" value="{{ old('name') }}" name="name" required autofocus>
                    </div>
                    @error('name')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="col-md-6">
                <div class="floating-input">
                    <label for="last_name" class="form-label">Primer Apellido *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-user-tag"></i> 
                        </span>
                        <input type="text" class="form-control" id="last_name" value="{{ old('last_name') }}" name="last_name" required>
                    </div>
                    @error('last_name')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Fila 2: Segundo Apellido y Correo Electrónico -->
        <div class="row mt-2">
            <div class="col-md-6">
                <div class="floating-input">
                    <label for="second_last_name" class="form-label">Segundo Apellido</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-user-tag"></i>
                        </span>
                        <input type="text" class="form-control" id="second_last_name" name="second_last_name" value="{{ old('second_last_name') }}">
                    </div>
                    @error('second_last_name')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="col-md-6">
                <div class="floating-input">
                    <label for="email" class="form-label">Correo electrónico *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-envelope"></i> 
                        </span>
                        <input type="email" class="form-control" id="email" name="email" value="{{ old('email') }}" required>
                    </div>
                    @error('email')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Fila 3: Confirmar Correo Electrónico -->
        <div class="row mt-2">
            <div class="col-md-12">
                <div class="floating-input">
                    <label for="email_confirmation" class="form-label">Confirmar Correo electrónico *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-envelope"></i> 
                        </span>
                        <input type="email" class="form-control" id="email_confirmation" name="email_confirmation" value="{{ old('email_confirmation') }}" required>
                    </div>
                    @error('email_confirmation')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <div class="mt-3">
            <button type="button" class="btn btn-primary next-button" onclick="nextSection()">
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
            </button>
        </div>
    </div>

    <div id="section2" class="position-relative pb-5" style="display: none;">
        <!-- Rejilla de 2 columnas para segunda sección -->
        <div class="row">
            <!-- Fila 4: Tipo de Persona y Razón Social -->
            <div class="col-md-6">
                <div class="floating-input">
                    <label for="tipo_persona" class="form-label">Tipo de Persona *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-users"></i> 
                        </span>
                        <select id="tipo_persona" class="form-control" name="tipo_persona" required>
                            <option value="" disabled {{ old('tipo_persona') ? '' : 'selected' }}>Selecciona una opción</option>
                            <option value="fisica" {{ old('tipo_persona') == 'fisica' ? 'selected' : '' }}>Persona Física</option>
                            <option value="moral" {{ old('tipo_persona') == 'moral' ? 'selected' : '' }}>Persona Moral</option>
                        </select>
                    </div>
                    @error('tipo_persona')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="col-md-6">
                <div class="floating-input">
                    <label for="razon_social" class="form-label">Razón Social *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-building"></i> 
                        </span>
                        <input type="text" class="form-control" id="razon_social" name="razon_social" value="{{ old('razon_social') }}" required>
                    </div>
                    @error('razon_social')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Fila 5: RFC -->
        <div class="row mt-2">
            <div class="col-md-6">
                <div class="floating-input">
                    <label for="rfc" class="form-label">RFC *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-id-card"></i>
                        </span>
                        <input type="text" class="form-control" id="rfc" name="rfc" value="{{ old('rfc') }}" required>
                    </div>
                    @error('rfc')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <button type="button" class="btn btn-secondary back-button" onclick="prevSection()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Regresar
            </button>

            <button type="submit" class="btn btn-primary submit-button">
                Registrarse
            </button>
        </div>
    </div>
</form>