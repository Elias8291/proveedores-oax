<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentación Requerida</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div id="section-6" class="form-section">
        <h2 class="section-title">
            <i class="fas fa-file-pdf"></i>
            Documentación Requerida
        </h2>
        
        <!-- Documentos para Personas Físicas -->
        <div class="document-category">
            <h3 class="document-category-title">
                <i class="fas fa-user"></i>
                Documentos Personales
            </h3>
            <div class="file-upload-grid">
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-receipt"></i>
                        <h4>Constancia de Situación Fiscal</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="constancia_situacion_fiscal" name="constancia_situacion_fiscal" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="constancia_situacion_fiscal" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Documento vigente emitido por el SAT
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-id-card"></i>
                        <h4>Identificación Oficial</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="identificacion_oficial" name="identificacion_oficial" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="identificacion_oficial" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            INE, pasaporte o cédula profesional
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-file-alt"></i>
                        <h4>Curriculum Actualizado</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="curriculum" name="curriculum" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="curriculum" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Versión actualizada con datos de contacto
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-home"></i>
                        <h4>Comprobante de Domicilio</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="comprobante_domicilio" name="comprobante_domicilio" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="comprobante_domicilio" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            No mayor a 3 meses de antigüedad
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-certificate"></i>
                        <h4>Acta de Nacimiento</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="acta_nacimiento" name="acta_nacimiento" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="acta_nacimiento" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Copia legible y completa
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-id-badge"></i>
                        <h4>CURP</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="curp" name="curp" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="curp" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Formato actualizado
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Documentos Fiscales -->
        <div class="document-category">
            <h3 class="document-category-title">
                <i class="fas fa-file-invoice-dollar"></i>
                Documentos Fiscales
            </h3>
            <div class="file-upload-grid">
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-file-contract"></i>
                        <h4>Carta Poder Simple</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="carta_poder" name="carta_poder" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="carta_poder" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Incluir identificación del representante
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-receipt"></i>
                        <h4>Acuse de Recibo</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="acuse_recibo" name="acuse_recibo" 
                               class="file-upload-input" accept=".pdf" required>
                        <label for="acuse_recibo" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Última declaración anual
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Documentos para Personas Morales -->
        <div class="document-category">
            <h3 class="document-category-title">
                <i class="fas fa-building"></i>
                Documentos para Personas Morales
            </h3>
            <div class="file-upload-grid">
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-file-signature"></i>
                        <h4>Acta Constitutiva</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="acta_constitutiva" name="acta_constitutiva" 
                               class="file-upload-input" accept=".pdf">
                        <label for="acta_constitutiva" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Inscrita en el Registro Público
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-file-contract"></i>
                        <h4>Modificaciones al Acta</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="modificaciones_acta" name="modificaciones_acta" 
                               class="file-upload-input" accept=".pdf">
                        <label for="modificaciones_acta" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Solo si aplica
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
                
                <div class="file-upload-card">
                    <div class="file-upload-header">
                        <i class="fas fa-stamp"></i>
                        <h4>Poder Notariado</h4>
                        <span class="file-type-badge">PDF</span>
                    </div>
                    <div class="file-upload-body">
                        <input type="file" id="poder_notariado" name="poder_notariado" 
                               class="file-upload-input" accept=".pdf">
                        <label for="poder_notariado" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Subir archivo</span>
                        </label>
                        <div class="file-upload-help">
                            <i class="fas fa-info-circle"></i>
                            Del representante legal
                        </div>
                    </div>
                    <div class="file-upload-state">
                        <span class="file-status-icon pending">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span class="file-status-text">Pendiente</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>