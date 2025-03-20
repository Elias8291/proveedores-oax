document.addEventListener("DOMContentLoaded", function () {
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

    window.displayQRCodeResult = function(url, container) {
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
        container.innerHTML = `
            <div class="alert alert-success mt-2">
                <strong>¡Código QR detectado!</strong>
                <button type="button" class="btn btn-info mt-2" id="openModalBtn" onclick="openDatosFiscalesModal()">
                    <i class="fas fa-eye"></i> Ver datos fiscales
                </button>
            </div>`;

        let lastFocusedElement = null;

        window.openDatosFiscalesModal = function () {
            lastFocusedElement = document.getElementById("openModalBtn");
            const modal = new bootstrap.Modal(document.getElementById("datosFiscalesModal"));
            modal.show();
            const modalBody = document.getElementById("datosFiscalesModalBody");
            modalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Cargando datos fiscales...</p></div>';
            fetchDataFromURL(url, modalBody);
        };

        fetchDataFromURL(url, null);

        const modalElement = document.getElementById("datosFiscalesModal");
        modalElement.addEventListener("shown.bs.modal", function () {
            const firstFocusable = modalElement.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
            const closeBtn = modalElement.querySelector('.btn-close');
            if (closeBtn) closeBtn.addEventListener('click', handleCloseClick);
            const cerrarBtn = modalElement.querySelector('.btn-secondary');
            if (cerrarBtn) cerrarBtn.addEventListener('click', handleCloseClick);
            const usarDatosBtn = document.getElementById("usarDatosBtn");
            if (usarDatosBtn) usarDatosBtn.addEventListener('click', handleUsarDatosClick);
        });

        function handleCloseClick(e) {
            e.preventDefault();
            document.getElementById('accessibility-focus-trap').focus();
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                if (modalInstance) modalInstance.hide();
                setTimeout(() => { if (lastFocusedElement) lastFocusedElement.focus(); }, 100);
            }, 10);
        }

        function handleUsarDatosClick(e) {
            e.preventDefault();
            processFormData();
            document.getElementById('accessibility-focus-trap').focus();
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                if (modalInstance) modalInstance.hide();
                setTimeout(() => { if (lastFocusedElement) lastFocusedElement.focus(); }, 100);
            }, 10);
        }

        modalElement.addEventListener("hidden.bs.modal", function () {
            if (lastFocusedElement) setTimeout(() => { lastFocusedElement.focus(); }, 50);
        });

        modalElement.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                document.getElementById('accessibility-focus-trap').focus();
                setTimeout(() => {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                    if (modalInstance) modalInstance.hide();
                    setTimeout(() => { if (lastFocusedElement) lastFocusedElement.focus(); }, 100);
                }, 10);
            }
        });
    };

    function processFormData() {
        const rfc = document.getElementById("dato_rfc")?.value || "";
        if (rfc) document.getElementById("rfc").value = rfc;
        const codigoPostal = document.getElementById("dato_codigo_postal")?.value || document.getElementById("dato_cp")?.value || document.getElementById("dato_codigo_postal_fiscal")?.value;
        if (codigoPostal) document.getElementById("codigo_postal").value = codigoPostal;
        const razonSocialInput = document.getElementById("razon_social");
        if (razonSocialInput) {
            const razonSocialPF = document.getElementById("dato_razon_social")?.value || "";
            razonSocialInput.value = razonSocialPF || document.getElementById("dato_nombre_denominacion_razon_social")?.value || document.getElementById("dato_nombre")?.value || "";
        }
        const calleInput = document.getElementById("calle");
        if (calleInput) calleInput.value = document.getElementById("dato_nombre_de_la_vialidad")?.value || "";
        const numExtInput = document.getElementById("numero_exterior");
        if (numExtInput) numExtInput.value = document.getElementById("dato_numero_exterior")?.value || "";
        const numIntInput = document.getElementById("numero_interior");
        if (numIntInput) numIntInput.value = document.getElementById("dato_numero_interior")?.value || "";
    }

    function fetchDataFromURL(url, modalBody) {
        fetch(url).then(response => response.text()).then(html => {
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
                    rows.forEach(row => {
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

            let curp = "", nombre = "", apellidoPaterno = "", apellidoMaterno = "", razonSocialPF = "";
            let codigoPostal = "", nombreVialidad = "", numeroExterior = "", numeroInterior = "";

            // Ampliar búsqueda de datos de domicilio
            sections.forEach(section => {
                const data = section.data;
                if (data["CURP"]) curp = data["CURP"];
                if (data["Nombre"]) nombre = data["Nombre"];
                if (data["Apellido Paterno"]) apellidoPaterno = data["Apellido Paterno"];
                if (data["Apellido Materno"]) apellidoMaterno = data["Apellido Materno"];

                // Variaciones de Código Postal
                codigoPostal = data["Código Postal"] || data["CP"] || data["Código Postal Fiscal"] || codigoPostal;

                // Variaciones de Nombre de la Vialidad
                nombreVialidad = data["Nombre de la Vialidad"] || data["Calle"] || data["Vialidad"] || nombreVialidad;

                // Variaciones de Número Exterior
                numeroExterior = data["Número Exterior"] || data["No. Exterior"] || data["Num. Exterior"] || numeroExterior;

                // Variaciones de Número Interior
                numeroInterior = data["Número Interior"] || data["No. Interior"] || data["Num. Interior"] || numeroInterior;
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
                                <tr><th>RFC</th><td>${rfc || "No se encontró RFC"}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card mb-2" style="font-size: 0.88rem;">
                    <div class="card-body" style="padding: 0.8rem;">
                        <h5 class="card-title" style="font-size: 1rem;">Domicilio</h5>
                        <table class="table table-striped" style="font-size: 0.8rem;">
                            <tbody>
                                <tr><th>Código Postal</th><td>${codigoPostal || "No disponible"}</td></tr>
                                <tr><th>Nombre de la Vialidad</th><td>${nombreVialidad || "No disponible"}</td></tr>
                                <tr><th>Número Exterior</th><td>${numeroExterior || "No disponible"}</td></tr>
                                <tr><th>Número Interior</th><td>${numeroInterior || "No disponible"}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`;

            sections.forEach(section => {
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
            if (codigoPostal) hiddenInputs += `<input type="hidden" id="dato_codigo_postal" name="dato_codigo_postal" value="${codigoPostal}">`;
            if (nombreVialidad) hiddenInputs += `<input type="hidden" id="dato_nombre_de_la_vialidad" name="dato_nombre_de_la_vialidad" value="${nombreVialidad}">`;
            if (numeroExterior) hiddenInputs += `<input type="hidden" id="dato_numero_exterior" name="dato_numero_exterior" value="${numeroExterior}">`;
            if (numeroInterior) hiddenInputs += `<input type="hidden" id="dato_numero_interior" name="dato_numero_interior" value="${numeroInterior}">`;
            sections.forEach(section => {
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
        }).catch(error => {
            if (modalBody) modalBody.innerHTML = `<div class="alert alert-danger">Error al obtener los datos del URL: ${error.message}</div>`;
        });
    }
});