// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Token de autenticación para VerificaMex
    const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTkwNmQwMTczMTcyZTY0MzE0NWI0ZDNhMTI0NjFmMzkwYzg1YTBjNmRiY2QwZTc5ODcwMGM3MzMzYTk4YThiNGJiZTkyZmNhMzFmZTA3ZDQiLCJpYXQiOjE3NDE3Mjk5MzcuNDk5MDQ3LCJuYmYiOjE3NDE3Mjk5MzcuNDk5MDY4LCJleHAiOjE3NzMyNjU5MzcuNDg4Nzc5LCJzdWIiOiI1MTIxIiwic2NvcGVzIjpbXX0.cmutxhBli-ZyQB-ZUSwXQriwqbYoZSktslniamI7AAH4kWvswPJNPRNP7IsfQdBCLp5E4ZwNUJScNR1MXYHf5D-eZUBdwJmxtAT0W1McuaZpO_RW92g4fw_Pdk8KLOywNt7rrnNJ2N9krOy_nDLn3pDQ66kdwSgyUHOxe8syWNjlxq16Q_BOqzQMbY6aSGObL88KXN2jExQ4IiRa0diiV4yFMub-kWwDdsihpkEfa5EJncFCiPKlEFYhcIQ89ORPSeZ30b8a95eoTSm_8aZqDINXbPu-Sh4C1Sa46FOekNJIMcVNOohEakuTycMyohoPi0_GvX8JIUnvh5NEfW8xkMGTcvlyK_5vmKNgiRBkxDIjeweJ2tenO4X18slCaLA-UTCUs3_tEB0F0AzlMwimSSW5M4xBxn7oPAWR6Voe3lwGPflytpfIeowrRQf0_XaSRlaA1Q21g5x4y0ZJyoAE-yXyJrHzGQorQofh3oT9aOsOo0UqlLMm8l-npalbHsWPV5BVBgNHVgS5eKSJOmTM34dplewxHDGjmITtOROyzs5h5SoFpYtrsxizkxfapMhH724GzWJlet0VE7qvguFBz_gso-AePtyWOkHo1QCOePxxmDB9IcqBBc1Jv690zRzjdPifvJ85lCmvwXPRO1XnMBxVF5iRH1M4rXOgBrlYeyo";

    // Elementos DOM - Verificar que existen antes de usarlos
    const curpInput = document.getElementById('curp');
    if (!curpInput) {
        console.error('Elemento con ID "curp" no encontrado');
        return;
    }

    // Buscar el mensaje de error asociado o crearlo si no existe
    let curpError;
    // Primero, buscar el elemento con clase 'formulario__input-error'
    const errorElements = curpInput.parentNode.querySelectorAll('.formulario__input-error');
    if (errorElements.length > 0) {
        curpError = errorElements[0];
    } else {
        // Si no existe, crear el elemento de error
        curpError = document.createElement('p');
        curpError.className = 'formulario__input-error';
        curpError.textContent = 'El CURP no tiene un formato válido.';
        curpInput.parentNode.appendChild(curpError);
    }

    let curpValidado = false;
    let curpTimeout = null;
    let loadingIndicator = null;
    let curpData = null; // Para almacenar los datos del CURP validado

    // Expresión regular para validación básica de CURP
    const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/;

    // Crear indicador de carga
    function createLoadingIndicator() {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'curp-loading';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando CURP...';
        loadingIndicator.style.color = '#666';
        loadingIndicator.style.fontSize = '0.85em';
        loadingIndicator.style.marginTop = '5px';
        curpInput.parentNode.insertBefore(loadingIndicator, curpError);
    }

    // Mostrar indicador de carga
    function showLoading() {
        if (!loadingIndicator) {
            createLoadingIndicator();
        }
        loadingIndicator.style.display = 'block';
    }

    // Ocultar indicador de carga
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    // Crear el modal para mostrar los datos del CURP
    function createCurpModal() {
        // Comprobar si ya existe el modal
        let modal = document.getElementById('curpModal');
        if (modal) {
            return modal;
        }

        // Crear elementos del modal
        modal = document.createElement('div');
        modal.id = 'curpModal';
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        modal.setAttribute('aria-labelledby', 'curpModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="curpModalLabel">
                            <i class="fas fa-id-card"></i> Información del CURP
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="curpModalBody">
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <div class="alert alert-success">
                                    <i class="fas fa-check-circle"></i> CURP validado correctamente en RENAPO
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="fw-bold">Datos Personales</h6>
                                <table class="table table-striped">
                                    <tbody>
                                        <tr>
                                            <th scope="row">CURP</th>
                                            <td id="modal-curp"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Nombre Completo</th>
                                            <td id="modal-nombre"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Sexo</th>
                                            <td id="modal-sexo"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Fecha de Nacimiento</th>
                                            <td id="modal-fecha-nacimiento"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Nacionalidad</th>
                                            <td id="modal-nacionalidad"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold">Información Adicional</h6>
                                <table class="table table-striped">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Entidad de Nacimiento</th>
                                            <td id="modal-entidad"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Clave Entidad</th>
                                            <td id="modal-clave-entidad"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Documento Probatorio</th>
                                            <td id="modal-doc-probatorio"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Status CURP</th>
                                            <td id="modal-status-curp"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Descripción Status</th>
                                            <td id="modal-status-desc"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <h6 class="fw-bold">Datos del Documento Probatorio</h6>
                                <table class="table table-striped">
                                    <tbody id="modal-datos-documento">
                                        <!-- Aquí se insertarán dinámicamente los datos del documento probatorio -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="confirmarDatosCurp">
                            <i class="fas fa-check"></i> Confirmar Datos
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Inicializar el modal con Bootstrap
        const modalInstance = new bootstrap.Modal(modal);
        
        // Configurar el botón confirmar
        const confirmarBtn = document.getElementById('confirmarDatosCurp');
        if (confirmarBtn) {
            confirmarBtn.addEventListener('click', function() {
                modalInstance.hide();
            });
        }
        
        return modal;
    }

    // Mostrar los datos del CURP en el modal
    function showCurpModal(data) {
        try {
            // Crear el modal si no existe
            createCurpModal();
            
            // Extraer los datos del ciudadano
            const citizenData = data.data.citizen.registros[0];
            
            // Llenar los datos en el modal
            document.getElementById('modal-curp').textContent = citizenData.curp || 'No disponible';
            document.getElementById('modal-nombre').textContent = `${citizenData.nombres || ''} ${citizenData.primerApellido || ''} ${citizenData.segundoApellido || ''}`.trim() || 'No disponible';
            document.getElementById('modal-sexo').textContent = citizenData.sexo || 'No disponible';
            document.getElementById('modal-fecha-nacimiento').textContent = formatearFecha(citizenData.fechaNacimiento) || 'No disponible';
            document.getElementById('modal-nacionalidad').textContent = obtenerNacionalidad(citizenData.nacionalidad) || 'No disponible';
            document.getElementById('modal-entidad').textContent = citizenData.entidad || 'No disponible';
            document.getElementById('modal-clave-entidad').textContent = citizenData.claveEntidad || 'No disponible';
            document.getElementById('modal-doc-probatorio').textContent = `${citizenData.docProbatorioDesc || ''} (${citizenData.docProbatorio || ''})`.trim() || 'No disponible';
            document.getElementById('modal-status-curp').textContent = citizenData.statusCurp || 'No disponible';
            document.getElementById('modal-status-desc').textContent = citizenData.statusCurpDesc || 'No disponible';
            
            // Llenar los datos del documento probatorio
            const datosDocTable = document.getElementById('modal-datos-documento');
            if (datosDocTable && citizenData.datosDocProbatorio) {
                const docData = citizenData.datosDocProbatorio;
                datosDocTable.innerHTML = '';
                
                // Mapeo de campos a mostrar - clave: [nombre a mostrar, formateador]
                const camposDoc = {
                    'entidadRegistro': ['Entidad de Registro', null],
                    'municipioRegistro': ['Municipio de Registro', null],
                    'anioReg': ['Año de Registro', null],
                    'numActa': ['Número de Acta', null],
                    'folioCarta': ['Folio de Carta', null],
                    'tomo': ['Tomo', null],
                    'libro': ['Libro', null],
                    'foja': ['Foja', null],
                    'numEntidadRegistrante': ['Entidad Registrante', null],
                    'numRegExtranjeros': ['Registro de Extranjeros', null]
                };
                
                // Generar filas para cada campo
                Object.entries(camposDoc).forEach(([clave, [nombre, formateador]]) => {
                    if (docData[clave] !== undefined && docData[clave] !== null && docData[clave] !== '') {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        th.scope = 'row';
                        th.textContent = nombre;
                        
                        const td = document.createElement('td');
                        td.textContent = formateador ? formateador(docData[clave]) : docData[clave];
                        
                        tr.appendChild(th);
                        tr.appendChild(td);
                        datosDocTable.appendChild(tr);
                    }
                });
                
                // Si no hay datos, mostrar mensaje
                if (datosDocTable.children.length === 0) {
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 2;
                    td.textContent = 'No hay datos disponibles del documento probatorio';
                    td.className = 'text-center';
                    tr.appendChild(td);
                    datosDocTable.appendChild(tr);
                }
            }
            
            // Mostrar el modal
            const modalElement = document.getElementById('curpModal');
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.show();
            
        } catch (error) {
            console.error('Error al mostrar el modal con datos del CURP:', error);
        }
    }
    
    // Función para formatear la fecha del formato ISO a formato legible
    function formatearFecha(fechaISO) {
        if (!fechaISO) return 'No disponible';
        
        try {
            const fecha = new Date(fechaISO);
            return fecha.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return fechaISO;
        }
    }
    
    // Función para obtener el nombre completo de la nacionalidad
    function obtenerNacionalidad(codigo) {
        const nacionalidades = {
            'MEX': 'Mexicana',
            'USA': 'Estadounidense',
            'CAN': 'Canadiense',
            'ARG': 'Argentina',
            'BRA': 'Brasileña',
            'COL': 'Colombiana',
            'CHI': 'Chilena',
            'ESP': 'Española',
            'FRA': 'Francesa',
            'ITA': 'Italiana'
            // Se pueden agregar más nacionalidades según sea necesario
        };
        
        return nacionalidades[codigo] || codigo;
    }

    // Función para validar el CURP con VerificaMex
    async function validarCURP(curp) {
        try {
            showLoading();
            
            const response = await fetch('https://api.verificamex.com/identity/v1/scraping/renapo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify({ curp: curp })
            });
            
            const data = await response.json();
            hideLoading();
            
            // Guardar los datos del CURP
            curpData = data;
            
            // Verificar si la respuesta es exitosa
            if (data.data && data.data.citizen && data.data.citizen.status === true) {
                // CURP válido en RENAPO
                curpError.textContent = '';
                curpError.style.display = 'none';
                
                // Agregar clase de éxito
                curpInput.classList.add('is-valid');
                curpInput.classList.remove('is-invalid');
                
                // Mostrar mensaje de éxito
                const successMsg = document.createElement('div');
                successMsg.className = 'curp-valid-message';
                successMsg.innerHTML = '<i class="fas fa-check-circle"></i> CURP verificado correctamente';
                successMsg.style.color = '#28a745';
                successMsg.style.fontSize = '0.85em';
                successMsg.style.marginTop = '5px';
                
                // Eliminar mensaje anterior si existe
                const prevMsg = curpInput.parentNode.querySelector('.curp-valid-message');
                if (prevMsg) {
                    prevMsg.remove();
                }
                
                curpInput.parentNode.insertBefore(successMsg, curpError);
                curpValidado = true;
                
                // Mostrar el modal con los datos del CURP
                showCurpModal(data);
                
                return true;
            } else {
                // CURP no válido en RENAPO
                curpError.textContent = 'CURP no encontrado en RENAPO o inválido.';
                curpError.style.display = 'block';
                
                // Agregar clase de error
                curpInput.classList.add('is-invalid');
                curpInput.classList.remove('is-valid');
                
                // Eliminar mensaje de éxito si existe
                const successMsg = curpInput.parentNode.querySelector('.curp-valid-message');
                if (successMsg) {
                    successMsg.remove();
                }
                
                curpValidado = false;
                return false;
            }
        } catch (error) {
            hideLoading();
            console.error('Error al validar CURP:', error);
            
            curpError.textContent = 'Error al validar el CURP. Intente de nuevo más tarde.';
            curpError.style.display = 'block';
            
            curpInput.classList.add('is-invalid');
            curpInput.classList.remove('is-valid');
            
            curpValidado = false;
            return false;
        }
    }

    // Validación local del formato CURP antes de enviar al API
    function validarFormatoCURP(curp) {
        return curpRegex.test(curp);
    }

    // Event listener para validar CURP cuando cambia el input
    curpInput.addEventListener('input', function() {
        const curp = this.value.toUpperCase();
        this.value = curp; // Convertir a mayúsculas automáticamente
        
        // Remover mensajes de éxito previos
        const successMsg = curpInput.parentNode.querySelector('.curp-valid-message');
        if (successMsg) {
            successMsg.remove();
        }
        
        // Cancelar la validación anterior si existe
        if (curpTimeout) {
            clearTimeout(curpTimeout);
        }
        
        // Si el campo está vacío, no mostrar error
        if (curp === '') {
            curpError.style.display = 'none';
            curpInput.classList.remove('is-invalid');
            curpInput.classList.remove('is-valid');
            hideLoading();
            curpValidado = false;
            return;
        }
        
        // Validar formato de CURP localmente
        if (!validarFormatoCURP(curp)) {
            curpError.textContent = 'El CURP no tiene un formato válido.';
            curpError.style.display = 'block';
            curpInput.classList.add('is-invalid');
            curpInput.classList.remove('is-valid');
            hideLoading();
            curpValidado = false;
            return;
        }
        
        // Validar con la API después de una pausa para evitar demasiadas peticiones
        curpTimeout = setTimeout(() => {
            validarCURP(curp);
        }, 500);
    });

    // Validar el formulario antes de enviar - verificar que existe
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            const curp = curpInput.value.trim();
            
            // Si el CURP está vacío y es persona física, verificar si es requerido
            // Aquí puedes agregar lógica para determinar si es obligatorio según tu caso
            
            // Si hay CURP pero no está validado, intentar validar antes de enviar
            if (curp !== '' && !curpValidado) {
                event.preventDefault(); // Prevenir envío del formulario
                
                // Validar formato localmente primero
                if (!validarFormatoCURP(curp)) {
                    curpError.textContent = 'El CURP no tiene un formato válido.';
                    curpError.style.display = 'block';
                    curpInput.classList.add('is-invalid');
                    return;
                }
                
                // Validar con RENAPO
                const esValido = await validarCURP(curp);
                
                // Si es válido, enviar el formulario
                if (esValido) {
                    this.submit();
                }
            }
        });
    } else {
        console.error('No se encontró un formulario en la página');
    }
    
    // Agregar estilos personalizados para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-header.bg-primary {
            background-color: #0d6efd !important;
        }
        #curpModal .table {
            margin-bottom: 0;
        }
        #curpModal th {
            width: 40%;
        }
        #curpModal .alert {
            margin-bottom: 0;
        }
        .curp-valid-message {
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
});