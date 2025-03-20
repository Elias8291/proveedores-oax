<form method="POST" action="{{ route('register') }}">
    @csrf

    <div id="section1" class="position-relative pb-5">
        <div class="row">
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
            <button type="button" class="btn btn-primary next-button">
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
            </button>
        </div>
    </div>

    <div id="section2" class="position-relative pb-5" style="display: none;">
        <div class="row mt-3">
            <div class="col-md-12">
                <div class="card pdf-upload-card">
                    <div class="card-body">
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
                        <div id="qr_result_container" class="qr-result mt-3"></div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="d-flex justify-content-between mt-3">
            <button type="button" class="btn btn-secondary back-button">
                Regresar
            </button>
            <button type="submit" class="btn btn-primary submit-button">
                Registrarse
            </button>
        </div>
    </div>
</form>

<!-- Modal -->
<div class="modal fade" id="datosFiscalesModal" tabindex="-1" role="dialog" aria-labelledby="datosFiscalesModalLabel">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content" style="border-radius: 14px; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);">
            <div class="modal-header" style="padding: 1rem; background: #9d2449;">
                <h5 class="modal-title" id="datosFiscalesModalLabel" style="font-size: 1.04rem; color: white; font-weight: 600;">Datos Fiscales</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="datosFiscalesModalBody" style="padding: 1.6rem;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p style="font-size: 0.88rem; margin-top: 0.8rem;">Procesando datos...</p>
                </div>
            </div>
            <div class="modal-footer" style="padding: 0.8rem; background-color: #f9fafb; border-top: 1px solid rgba(0, 0, 0, 0.05);">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="font-size: 0.76rem; padding: 0.5rem 1rem; border-radius: 9px;">Cerrar</button>
                <button type="button" class="btn btn-primary" id="usarDatosBtn" style="font-size: 0.76rem; padding: 0.5rem 1rem; border-radius: 9px; background: #9d2449;">Usar estos datos</button>
            </div>
        </div>
    </div>
</div>