document.addEventListener("DOMContentLoaded", function () {
    const pdfjsScript = document.createElement("script");
    pdfjsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    document.head.appendChild(pdfjsScript);

    const jsQRScript = document.createElement("script");
    jsQRScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
    document.head.appendChild(jsQRScript);

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
                if (code) {
                    window.displayQRCodeResult(code.data, resultContainer);
                } else {
                    processPages(pdf, pageNum + 1, totalPages, resultContainer);
                }
            }).catch(function (error) {
                resultContainer.innerHTML = '<div class="text-danger">Error al renderizar la página: ' + error.message + "</div>";
            });
        });
    }
});