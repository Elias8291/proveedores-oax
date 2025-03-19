document.addEventListener("DOMContentLoaded", function () {
    const pdfjsScript = document.createElement("script");
    pdfjsScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    document.head.appendChild(pdfjsScript);

    const jsQRScript = document.createElement("script");
    jsQRScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
    document.head.appendChild(jsQRScript);

    const modalHTML = `
    <div class="modal fade" id="datosFiscalesModal" tabindex="-1" aria-labelledby="datosFiscalesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-md"> <!-- Changed from modal-lg to modal-md -->
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
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    pdfjsScript.onload = function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        const constanciaInput = document.getElementById("constancia_fiscal");
        if (constanciaInput)
            constanciaInput.addEventListener("change", handleFileUpload);
    };

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            let qrResultContainer = document.getElementById(
                "qr_result_container"
            );
            if (!qrResultContainer) {
                qrResultContainer = document.createElement("div");
                qrResultContainer.id = "qr_result_container";
                qrResultContainer.className = "mt-2";
                event.target.parentNode.parentNode.appendChild(
                    qrResultContainer
                );
            }
            qrResultContainer.innerHTML =
                '<div class="text-info">Procesando el documento...</div>';
            const fileReader = new FileReader();
            fileReader.onload = function () {
                const typedArray = new Uint8Array(this.result);
                window.pdfjsLib
                    .getDocument(typedArray)
                    .promise.then(function (pdf) {
                        processPages(pdf, 1, pdf.numPages, qrResultContainer);
                    })
                    .catch(function (error) {
                        qrResultContainer.innerHTML =
                            '<div class="text-danger">Error al procesar el PDF: ' +
                            error.message +
                            "</div>";
                    });
            };
            fileReader.readAsArrayBuffer(file);
        }
    }

    function processPages(pdf, pageNum, totalPages, resultContainer) {
        if (pageNum > totalPages) {
            resultContainer.innerHTML =
                '<div class="text-danger">No se encontró ningún código QR en el documento</div>';
            return;
        }
        pdf.getPage(pageNum).then(function (page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext)
                .promise.then(function () {
                    const imageData = context.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    const code = jsQR(
                        imageData.data,
                        imageData.width,
                        imageData.height,
                        { inversionAttempts: "dontInvert" }
                    );
                    if (code) displayQRCodeResult(code.data, resultContainer);
                    else
                        processPages(
                            pdf,
                            pageNum + 1,
                            totalPages,
                            resultContainer
                        );
                })
                .catch(function (error) {
                    resultContainer.innerHTML =
                        '<div class="text-danger">Error al renderizar la página: ' +
                        error.message +
                        "</div>";
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
        container.innerHTML = `
            <div class="alert alert-success mt-2">
                <strong>¡Código QR detectado!</strong>
                <button type="button" class="btn btn-info mt-2" onclick="openDatosFiscalesModal()">
                    <i class="fas fa-eye"></i> Ver datos fiscales
                </button>
            </div>`;

        window.openDatosFiscalesModal = function () {
            const modal = new bootstrap.Modal(
                document.getElementById("datosFiscalesModal")
            );
            modal.show();

            const modalBody = document.getElementById("datosFiscalesModalBody");
            modalBody.innerHTML =
                '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Cargando datos fiscales...</p></div>';

            fetchDataFromURL(url, modalBody);
        };

        fetchDataFromURL(url, null);
    }

    function fetchDataFromURL(url, modalBody) {
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
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
    
                    if (Object.keys(sectionData).length > 0) {
                        sections.push({ title: sectionTitle, data: sectionData });
                    }
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
    
                // Extract CURP and related fields if available
                let curp = "";
                let nombre = "";
                let apellidoPaterno = "";
                let apellidoMaterno = "";
                let razonSocialPF = "";
                sections.forEach((section) => {
                    if (section.data["CURP"]) curp = section.data["CURP"];
                    if (section.data["Nombre"]) nombre = section.data["Nombre"];
                    if (section.data["Apellido Paterno"]) apellidoPaterno = section.data["Apellido Paterno"];
                    if (section.data["Apellido Materno"]) apellidoMaterno = section.data["Apellido Materno"];
                });
    
                // Construct Razón Social for Persona Física if CURP exists
                if (curp && nombre && apellidoPaterno && apellidoMaterno) {
                    razonSocialPF = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
                }
    
                // Build the modal content
                let extractedData = `
                    <div class="mb-2" style="font-size: 0.88rem;">
                        <p><strong>Datos obtenidos del URL:</strong> <a href="${url}" target="_blank">${url}</a></p>
                    </div>
                    <div class="card mb-2" style="font-size: 0.88rem;">
                        <div class="card-body" style="padding: 0.8rem;">
                            <h5 class="card-title" style="font-size: 1rem;">Datos Principales</h5>
                            <table class="table table-striped" style="font-size: 0.8rem;">
                                <tbody>
                                    <tr>
                                        <th>RFC</th>
                                        <td>${rfc || "No se encontró RFC en el documento"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>`;
    
                sections.forEach((section) => {
                    extractedData += `
                        <div class="card mb-2" style="font-size: 0.88rem;">
                            <div class="card-body" style="padding: 0.8rem;">
                                <h5 class="card-title" style="font-size: 1rem;">${section.title}</h5>
                                <table class="table table-striped" style="font-size: 0.8rem;">
                                    <tbody>`;
                    for (const [label, value] of Object.entries(section.data)) {
                        extractedData += `
                                    <tr>
                                        <th>${label}</th>
                                        <td>${value}</td>
                                    </tr>`;
                    }
                    extractedData += `
                                    </tbody>
                                </table>
                            </div>
                        </div>`;
                });
    
                // Add Persona Física section if CURP exists
                if (curp) {
                    extractedData += `
                        <div class="card mb-2" style="font-size: 0.88rem;">
                            <div class="card-body" style="padding: 0.8rem;">
                                <h5 class="card-title" style="font-size: 1rem;">Persona Física</h5>
                                <table class="table table-striped" style="font-size: 0.8rem;">
                                    <tbody>
                                        <tr>
                                            <th>CURP</th>
                                            <td>${curp}</td>
                                        </tr>
                                        <tr>
                                            <th>Nombre</th>
                                            <td>${nombre}</td>
                                        </tr>
                                        <tr>
                                            <th>Apellido Paterno</th>
                                            <td>${apellidoPaterno}</td>
                                        </tr>
                                        <tr>
                                            <th>Apellido Materno</th>
                                            <td>${apellidoMaterno}</td>
                                        </tr>
                                        <tr>
                                            <th>Razón Social</th>
                                            <td>${razonSocialPF}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>`;
                }
    
                // Hidden inputs for form submission
                let hiddenInputs = "";
                if (rfc) {
                    hiddenInputs += `<input type="hidden" id="dato_rfc" name="dato_rfc" value="${rfc}">`;
                }
                if (curp) {
                    hiddenInputs += `<input type="hidden" id="dato_curp" name="dato_curp" value="${curp}">`;
                }
                if (razonSocialPF) {
                    hiddenInputs += `<input type="hidden" id="dato_razon_social" name="dato_razon_social" value="${razonSocialPF}">`;
                }
                sections.forEach((section) => {
                    for (const [label, value] of Object.entries(section.data)) {
                        const cleanLabel = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
                        hiddenInputs += `<input type="hidden" id="dato_${cleanLabel}" name="dato_${cleanLabel}" value="${value}">`;
                    }
                });
    
                const hiddenInputsContainer = document.createElement("div");
                hiddenInputsContainer.id = "hidden_inputs_container";
                hiddenInputsContainer.style.display = "none";
                hiddenInputsContainer.innerHTML = hiddenInputs;
                document.body.appendChild(hiddenInputsContainer);
    
                if (modalBody) {
                    modalBody.innerHTML = extractedData;
                }
    
                const usarDatosBtn = document.getElementById("usarDatosBtn");
                if (usarDatosBtn) {
                    usarDatosBtn.onclick = function () {
                        if (rfc) {
                            const rfcInput = document.getElementById("rfc");
                            if (rfcInput) rfcInput.value = rfc;
                        }
                        const codigoPostalInput = document.getElementById("codigo_postal");
                        if (codigoPostalInput) {
                            const cpValue =
                                document.getElementById("dato_codigo_postal") ||
                                document.getElementById("dato_cp") ||
                                document.getElementById("dato_codigo_postal_fiscal");
                            if (cpValue) codigoPostalInput.value = cpValue.value;
                        }
                        const razonSocialInput = document.getElementById("razon_social");
                        if (razonSocialInput) {
                            // Use Razón Social from Persona Física if available, otherwise fallback to existing logic
                            if (razonSocialPF) {
                                razonSocialInput.value = razonSocialPF;
                            } else {
                                const rsValue =
                                    document.getElementById("dato_razon_social") ||
                                    document.getElementById("dato_nombre_denominacion_razon_social") ||
                                    document.getElementById("dato_nombre");
                                if (rsValue) razonSocialInput.value = rsValue.value;
                            }
                        }
                        const modal = bootstrap.Modal.getInstance(document.getElementById("datosFiscalesModal"));
                        modal.hide();
                    };
                }
            })
            .catch((error) => {
                if (modalBody) {
                    modalBody.innerHTML = `<div class="alert alert-danger">Error al obtener los datos del URL: ${error.message}</div>`;
                }
            });
    }
});
