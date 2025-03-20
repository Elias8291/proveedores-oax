<form method="POST" action="{{ route('register') }}">
    @csrf

    <div id="section1" class="position-relative pb-5">
        <!-- Campo para subir el PDF -->
        <div class="row">
            <div class="col-md-12">
                <div class="floating-input">
                    <label for="constancia_fiscal" class="form-label">Constancia de Situación Fiscal (PDF) *</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-file-pdf"></i>
                        </span>
                        <input type="file" class="form-control custom-file-input" id="constancia_fiscal" name="constancia_fiscal" accept="application/pdf" required>
                    </div>
                    <div class="file-upload-info mt-1">
                        <small class="text-muted">Sube tu Constancia de Situación Fiscal en formato PDF</small>
                    </div>
                    @error('constancia_fiscal')
                        <div class="text-danger mt-1">{{ $message }}</div>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Campo de correo electrónico -->
        <div class="row mt-2">
            <div class="col-md-12">
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

        <!-- Campo de confirmación de correo electrónico -->
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

        <!-- Botón de registro -->
        <div class="mt-3">
            <button type="submit" class="btn btn-primary submit-button">
                Registrarse
            </button>
        </div>
    </div>
</form>