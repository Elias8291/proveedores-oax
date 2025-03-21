document.addEventListener("DOMContentLoaded", function () {
    const pdfjsScript = document.createElement("script");
    pdfjsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    document.head.appendChild(pdfjsScript);

    const jsQRScript = document.createElement("script");
    jsQRScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
    document.head.appendChild(jsQRScript);

    const focusTrap = document.createElement("div");
    focusTrap.id = "accessibility-focus-trap";
    focusTrap.setAttribute("tabindex", "-1");
    focusTrap.style.position = "absolute";
    focusTrap.style.opacity = "0";
    focusTrap.style.pointerEvents = "none";
    document.body.appendChild(focusTrap);

    const patchBootstrapModal = function() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const originalHide = bootstrap.Modal.prototype.hide;
            bootstrap.Modal.prototype.hide = function() {
                const modalElement = this._element;
                const activeElement = document.activeElement;
                if (modalElement.contains(activeElement)) {
                    document.getElementById('accessibility-focus-trap').focus();
                }
                return originalHide.apply(this, arguments);
            };
        }
    };

    window.addEventListener('load', patchBootstrapModal);

    pdfjsScript.onload = function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        const constanciaInput = document.getElementById("constancia_fiscal");
        if (constanciaInput)
            constanciaInput.addEventListener("change", handleFileUpload);
    };

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            let qrResultContainer = document.getElementById("qr_result_container");
            if (!qrResultContainer) {
                qrResultContainer = document.createElement("div");
                qrResultContainer.id = "qr_result_container";
                qrResultContainer.className = "mt-2";
                event.target.parentNode.parentNode.appendChild(qrResultContainer);
            }
            qrResultContainer.innerHTML = '<div class="text-info">Procesando el documento...</div>';
            const fileReader = new FileReader();
            fileReader.onload = function () {
                const typedArray = new Uint8Array(this.result);
                window.pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                    processPages(pdf, 1, pdf.numPages, qrResultContainer);
                }).catch(function (error) {
                    qrResultContainer.innerHTML = '<div class="text-danger">Error al procesar el PDF: ' + error.message + "</div>";
                });
            };
            fileReader.readAsArrayBuffer(file);
        }
    }

    function processPages(pdf, pageNum, totalPages, resultContainer) {
        if (pageNum > totalPages) {
            resultContainer.innerHTML = '<div class="text-danger">No se encontró ningún código QR en el documento</div>';
            return;
        }
        pdf.getPage(pageNum).then(function (page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = { canvasContext: context, viewport: viewport };
            page.render(renderContext).promise.then(function () {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
                if (code) displayQRCodeResult(code.data, resultContainer);
                else processPages(pdf, pageNum + 1, totalPages, resultContainer);
            }).catch(function (error) {
                resultContainer.innerHTML = '<div class="text-danger">Error al renderizar la página: ' + error.message + "</div>";
            });
        });
    }

    function displayQRCodeResult(url, container) {
        let hiddenInput = document.getElementById("qr_code_url");
        if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.id = "qr_code_url";
            hiddenInput.name = "qr_code_url";
            container.appendChild(hiddenInput);
        }
        hiddenInput.value = url;

        if (!url.startsWith("https://siat.sat.gob.mx/")) {
            container.innerHTML = `
                <div class="alert alert-danger mt-2 custom-error-alert">
                    <strong class="error-title">¡Error!</strong> 
                    <span class="error-message">El código QR detectado no es válido. Debe provenir de https://siat.sat.gob.mx/.</span>
                    <div class="url-container mt-1">URL detectada: 
                        <a href="${url}" target="_blank" class="error-url">${url}</a>
                    </div>
                </div>`;
            return;
        }
        
        // Show only a simple success indicator with a checkmark icon
        container.innerHTML = `
            <div class="alert alert-success mt-2 py-2">
                <i class="fas fa-check-circle"></i> <strong>QR validado correctamente</strong>
            </div>`;

        let lastFocusedElement = document.activeElement;
        
        // Start fetching data and automatically open modal when ready
        fetchDataFromURL(url, null, function() {
            // Callback after data is fetched - open modal automatically
            openDatosFiscalesModal();
        });

        window.openDatosFiscalesModal = function () {
            lastFocusedElement = document.activeElement;
            const modalElement = document.getElementById("datosFiscalesModal");
            
            // Ensure we have confirmation buttons in the modal footer
            const modalFooter = modalElement.querySelector(".modal-footer");
            if (modalFooter) {
                modalFooter.innerHTML = `
                    <button type="button" class="btn btn-primary" id="confirmarDatosBtn">Sí, utilizar estos datos</button>
                    <button type="button" class="btn btn-secondary" id="rechazarDatosBtn">No, subir otro documento</button>
                `;
            }
            
            const modalBody = document.getElementById("datosFiscalesModalBody");
            if (!modalBody.innerHTML.includes("table")) {
                modalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Cargando datos fiscales...</p></div>';
                fetchDataFromURL(url, modalBody);
            }
            
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        };

        const modalElement = document.getElementById("datosFiscalesModal");
        
        // Update modal title to include confirmation question
        const modalTitle = modalElement.querySelector(".modal-title");
        if (modalTitle) {
            modalTitle.textContent = "¿Desea utilizar estos datos fiscales?";
        }
        
        modalElement.addEventListener("shown.bs.modal", function () {
            const firstFocusable = modalElement.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
            
            // Set up event listeners for the new confirmation buttons
            const confirmarDatosBtn = document.getElementById("confirmarDatosBtn");
            if (confirmarDatosBtn) {
                confirmarDatosBtn.removeEventListener('click', handleConfirmarDatosClick);
                confirmarDatosBtn.addEventListener('click', handleConfirmarDatosClick);
            }
            
            const rechazarDatosBtn = document.getElementById("rechazarDatosBtn");
            if (rechazarDatosBtn) {
                rechazarDatosBtn.removeEventListener('click', handleRechazarDatosClick);
                rechazarDatosBtn.addEventListener('click', handleRechazarDatosClick);
            }
            
            const closeBtn = modalElement.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.removeEventListener('click', handleCloseClick);
                closeBtn.addEventListener('click', handleCloseClick);
            }
        });

        function handleConfirmarDatosClick(e) {
            e.preventDefault();
            processFormData();
            document.getElementById('accessibility-focus-trap').focus();
            
            // Update the container to show that data was used with just a checkmark
            container.innerHTML = `
                <div class="alert alert-success mt-2 py-2">
                    <i class="fas fa-check-circle"></i> <strong>Datos fiscales aplicados</strong>
                </div>`;
                
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                if (modalInstance) modalInstance.hide();
                setTimeout(() => { if (lastFocusedElement) lastFocusedElement.focus(); }, 100);
            }, 10);
        }
        
        function handleRechazarDatosClick(e) {
            e.preventDefault();
            
            // First close the modal
            document.getElementById('accessibility-focus-trap').focus();
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                if (modalInstance) modalInstance.hide();
                
                // Then show confirmation dialog
                setTimeout(() => {
                   
                        // Clear the current data
                        const hiddenInputsContainer = document.getElementById("hidden_inputs_container");
                        if (hiddenInputsContainer) {
                            hiddenInputsContainer.innerHTML = "";
                        }
                        
                        // Reset the file input to allow uploading a new file
                        const constanciaInput = document.getElementById("constancia_fiscal");
                        if (constanciaInput) {
                            constanciaInput.value = "";
                        }
                        
                        // Update the container to prompt for a new upload
                        container.innerHTML = `
                            <div class="alert alert-info mt-2">
                                <strong>Por favor suba un nuevo documento.</strong>
                            </div>`;
                  
                }, 100);
            }, 10);
        }

        function handleCloseClick(e) {
            e.preventDefault();
            document.getElementById('accessibility-focus-trap').focus();
            
            // Show confirmation dialog when closing without a decision
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                if (modalInstance) modalInstance.hide();
                
                setTimeout(() => {
                    if (confirm("¿Desea utilizar estos datos fiscales?")) {
                        processFormData();
                        container.innerHTML = `
                            <div class="alert alert-success mt-2 py-2">
                                <i class="fas fa-check-circle"></i> <strong>Datos fiscales aplicados</strong>
                            </div>`;
                    } else {
                        // Clear the current data
                        const hiddenInputsContainer = document.getElementById("hidden_inputs_container");
                        if (hiddenInputsContainer) {
                            hiddenInputsContainer.innerHTML = "";
                        }
                        
                        // Reset the file input
                        const constanciaInput = document.getElementById("constancia_fiscal");
                        if (constanciaInput) {
                            constanciaInput.value = "";
                        }
                        
                        container.innerHTML = `
                            <div class="alert alert-info mt-2">
                                <strong>Por favor suba un nuevo documento.</strong>
                            </div>`;
                    }
                    
                    if (lastFocusedElement) lastFocusedElement.focus();
                }, 100);
            }, 10);
        }

        modalElement.addEventListener("hidden.bs.modal", function () {
            if (lastFocusedElement) setTimeout(() => { lastFocusedElement.focus(); }, 50);
        });

        modalElement.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                document.getElementById('accessibility-focus-trap').focus();
                
                // Show confirmation dialog when pressing escape
                setTimeout(() => {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                    if (modalInstance) modalInstance.hide();
                    
                    setTimeout(() => {
                        if (confirm("¿Desea utilizar estos datos fiscales?")) {
                            processFormData();
                            container.innerHTML = `
                                <div class="alert alert-success mt-2 py-2">
                                    <i class="fas fa-check-circle"></i> <strong>Datos fiscales aplicados</strong>
                                </div>`;
                        } else {
                            // Clear current data
                            const hiddenInputsContainer = document.getElementById("hidden_inputs_container");
                            if (hiddenInputsContainer) {
                                hiddenInputsContainer.innerHTML = "";
                            }
                            
                            // Reset file input
                            const constanciaInput = document.getElementById("constancia_fiscal");
                            if (constanciaInput) {
                                constanciaInput.value = "";
                            }
                            
                            container.innerHTML = `
                                <div class="alert alert-info mt-2">
                                    <strong>Por favor suba un nuevo documento.</strong>
                                </div>`;
                        }
                        
                        if (lastFocusedElement) lastFocusedElement.focus();
                    }, 100);
                }, 10);
            }
        });
    }

    function processFormData() {
        const rfc = document.getElementById("dato_rfc")?.value || "";
        if (rfc) {
            const rfcInput = document.getElementById("rfc");
            if (rfcInput) rfcInput.value = rfc;
        }
        
        // Procesar código postal
        const codigoPostalInput = document.getElementById("codigo_postal");
        if (codigoPostalInput) {
            const cpValue = document.getElementById("dato_codigo_postal")?.value || 
                           document.getElementById("dato_cp")?.value || 
                           document.getElementById("dato_codigo_postal_fiscal")?.value;
            if (cpValue) codigoPostalInput.value = cpValue;
        }
        
        // Procesar razón social
        const razonSocialInput = document.getElementById("razon_social");
        if (razonSocialInput) {
            const razonSocialPF = document.getElementById("dato_razon_social")?.value || "";
            if (razonSocialPF) {
                razonSocialInput.value = razonSocialPF;
            } else {
                const rsValue = document.getElementById("dato_nombre_denominacion_razon_social")?.value || document.getElementById("dato_nombre")?.value;
                if (rsValue) razonSocialInput.value = rsValue;
            }
        }
        
        const calleInput = document.getElementById("calle");
        if (calleInput) {
            const calleValue = document.getElementById("dato_nombre_de_la_vialidad")?.value;
            if (calleValue) calleInput.value = calleValue;
        }
        
        const numExtInput = document.getElementById("num_ext");
        if (numExtInput) {
            const numExtValue = document.getElementById("dato_numero_exterior")?.value;
            if (numExtValue) numExtInput.value = numExtValue;
        }
        
        const numIntInput = document.getElementById("num_int");
        if (numIntInput) {
            const numIntValue = document.getElementById("dato_numero_interior")?.value;
            if (numIntValue) numIntInput.value = numIntValue;
        }
    }

    function fetchDataFromURL(url, modalBody, callback) {
        fetch(url).then((response) => response.text()).then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const sections = [];
            const sectionElements = doc.querySelectorAll('ul[data-role="listview"]');
            sectionElements.forEach((section, index) => {
                const sectionTitle = section.querySelector('li[data-role="list-divider"]')?.textContent.trim() || `Sección ${index + 1}`;
                const dataTable = section.querySelector('tbody[id$="_data"]');
                const sectionData = {};
                if (dataTable) {
                    const rows = dataTable.querySelectorAll("tr");
                    rows.forEach((row) => {
                        const cells = row.querySelectorAll("td");
                        if (cells.length >= 2) {
                            let label = cells[0].textContent.trim().replace(/:$/, "");
                            const value = cells[1].textContent.trim();
                            sectionData[label] = value;
                        }
                    });
                }
                if (Object.keys(sectionData).length > 0) sections.push({ title: sectionTitle, data: sectionData });
            });

            let rfc = "";
            const rfcElement = doc.querySelector("li.ui-li-static");
            if (rfcElement) {
                const rfcMatch = rfcElement.textContent.match(/RFC:\s*([A-Z]{3,4}[0-9]{6}[A-Z0-9]{3})/i);
                rfc = rfcMatch ? rfcMatch[1] : "";
            }
            if (!rfc) {
                const rfcMatchAnywhere = html.match(/RFC:\s*([A-Z]{3,4}[0-9]{6}[A-Z0-9]{3})/i);
                rfc = rfcMatchAnywhere ? rfcMatchAnywhere[1] : "";
            }

            // Extraer datos de dirección del HTML directamente si no están en sections
            let codigoPostal = "", nombreVialidad = "", numeroExterior = "", numeroInterior = "";
            let domicilioInfo = html.match(/Datos de Ubicación \(domicilio fiscal, vigente\)([\s\S]*?)(?=<\/ul>|<ul)/i);
            
            if (domicilioInfo && domicilioInfo[1]) {
                // Extraer código postal
                const cpMatch = domicilioInfo[1].match(/CP\s*(\d{5})/i);
                if (cpMatch) codigoPostal = cpMatch[1];
                
                // Extraer nombre de vialidad
                const calleMatch = domicilioInfo[1].match(/Nombre de la vialidad\s*([^<]+)/i);
                if (calleMatch) nombreVialidad = calleMatch[1].trim();
                
                // Extraer número exterior
                const numExtMatch = domicilioInfo[1].match(/Número exterior\s*([^<]+)/i);
                if (numExtMatch) numeroExterior = numExtMatch[1].trim();
                
                // Extraer número interior
                const numIntMatch = domicilioInfo[1].match(/Número interior\s*([^<]+)/i);
                if (numIntMatch) numeroInterior = numIntMatch[1].trim();
            }
            
            sections.forEach((section) => {
                if (section.data["CP"]) codigoPostal = section.data["CP"];
                if (section.data["Nombre de la vialidad"]) nombreVialidad = section.data["Nombre de la vialidad"];
                if (section.data["Número exterior"]) numeroExterior = section.data["Número exterior"];
                if (section.data["Número interior"]) numeroInterior = section.data["Número interior"];
            });

            let curp = "", nombre = "", apellidoPaterno = "", apellidoMaterno = "", razonSocialPF = "";
            sections.forEach((section) => {
                if (section.data["CURP"]) curp = section.data["CURP"];
                if (section.data["Nombre"]) nombre = section.data["Nombre"];
                if (section.data["Apellido Paterno"]) apellidoPaterno = section.data["Apellido Paterno"];
                if (section.data["Apellido Materno"]) apellidoMaterno = section.data["Apellido Materno"];
            });
            if (curp && nombre && apellidoPaterno && apellidoMaterno) {
                razonSocialPF = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
            }

            let extractedData = `
                <div class="mb-2" style="font-size: 0.88rem;">
                    <p><strong>Datos obtenidos del URL:</strong> 
                        <a href="${url}" target="_blank" title="${url}">
                            <i class="fas fa-link" style="color: #9d2449;"></i>
                        </a>
                    </p>
                </div>
                <div class="card mb-2" style="font-size: 0.88rem;">
                    <div class="card-body" style="padding: 0.8rem;">
                        <h5 class="card-title" style="font-size: 1rem;">Datos Principales</h5>
                        <table class="table table-striped" style="font-size: 0.8rem;">
                            <tbody>
                                <tr><th>RFC</th><td>${rfc || "No se encontró RFC en el documento"}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`;
                
                extractedData += `
                <div class="card mb-2" style="font-size: 0.88rem;">
                    <div class="card-body" style="padding: 0.8rem;">
                        <h5 class="card-title" style="font-size: 1rem;">Datos de Ubicación (domicilio fiscal)</h5>
                        <table class="table table-striped" style="font-size: 0.8rem;">
                            <tbody>
                                <tr><th>Código Postal</th><td>${codigoPostal || "No disponible"}</td></tr>
                                <tr><th>Nombre de la vialidad</th><td>${nombreVialidad || "No disponible"}</td></tr>
                                <tr><th>Número exterior</th><td>${numeroExterior || "No disponible"}</td></tr>
                                <tr><th>Número interior</th><td>${numeroInterior || "No disponible"}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`;
                
            sections.forEach((section) => {
                if (!section.title.includes("Ubicación") && !section.title.includes("Domicilio")) {
                    extractedData += `
                        <div class="card mb-2" style="font-size: 0.88rem;">
                            <div class="card-body" style="padding: 0.8rem;">
                                <h5 class="card-title" style="font-size: 1rem;">${section.title}</h5>
                                <table class="table table-striped" style="font-size: 0.8rem;">
                                    <tbody>`;
                    for (const [label, value] of Object.entries(section.data)) {
                        extractedData += `<tr><th>${label}</th><td>${value}</td></tr>`;
                    }
                    extractedData += `</tbody></table></div></div>`;
                }
            });
            
            if (curp) {
                extractedData += `
                    <div class="card mb-2" style="font-size: 0.88rem;">
                        <div class="card-body" style="padding: 0.8rem;">
                            <h5 class="card-title" style="font-size: 1rem;">Persona Física</h5>
                            <table class="table table-striped" style="font-size: 0.8rem;">
                                <tbody>
                                    <tr><th>CURP</th><td>${curp}</td></tr>
                                    <tr><th>Nombre</th><td>${nombre}</td></tr>
                                    <tr><th>Apellido Paterno</th><td>${apellidoPaterno}</td></tr>
                                    <tr><th>Apellido Materno</th><td>${apellidoMaterno}</td></tr>
                                    <tr><th>Razón Social</th><td>${razonSocialPF}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>`;
            }

            let hiddenInputs = "";
            if (rfc) hiddenInputs += `<input type="hidden" id="dato_rfc" name="dato_rfc" value="${rfc}">`;
            if (curp) hiddenInputs += `<input type="hidden" id="dato_curp" name="dato_curp" value="${curp}">`;
            if (razonSocialPF) hiddenInputs += `<input type="hidden" id="dato_razon_social" name="dato_razon_social" value="${razonSocialPF}">`;
            
            // Añadir campos ocultos para los datos de ubicación
            if (codigoPostal) hiddenInputs += `<input type="hidden" id="dato_codigo_postal" name="dato_codigo_postal" value="${codigoPostal}">`;
            if (nombreVialidad) hiddenInputs += `<input type="hidden" id="dato_nombre_de_la_vialidad" name="dato_nombre_de_la_vialidad" value="${nombreVialidad}">`;
            if (numeroExterior) hiddenInputs += `<input type="hidden" id="dato_numero_exterior" name="dato_numero_exterior" value="${numeroExterior}">`;
            if (numeroInterior) hiddenInputs += `<input type="hidden" id="dato_numero_interior" name="dato_numero_interior" value="${numeroInterior}">`;
            
            sections.forEach((section) => {
                for (const [label, value] of Object.entries(section.data)) {
                    const cleanLabel = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
                    hiddenInputs += `<input type="hidden" id="dato_${cleanLabel}" name="dato_${cleanLabel}" value="${value}">`;
                }
            });

            const hiddenInputsContainer = document.getElementById("hidden_inputs_container") || document.createElement("div");
            hiddenInputsContainer.id = "hidden_inputs_container";
            hiddenInputsContainer.style.display = "none";
            hiddenInputsContainer.innerHTML = hiddenInputs;
            if (!document.getElementById("hidden_inputs_container")) document.body.appendChild(hiddenInputsContainer);

            if (modalBody) modalBody.innerHTML = extractedData;
            if (typeof callback === 'function') {
                callback();
            }
        }).catch((error) => {
            if (modalBody) modalBody.innerHTML = `<div class="alert alert-danger">Error al obtener los datos del URL: ${error.message}</div>`;
            
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
});