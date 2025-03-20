<form method="POST" action="{{ route('register') }}" enctype="multipart/form-data">
    @csrf

    <div id="section1" class="position-relative pb-5">
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