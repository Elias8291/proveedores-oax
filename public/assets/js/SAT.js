document.addEventListener('DOMContentLoaded', function() {
    // Get the necessary form elements
    const codigoPostalInput = document.getElementById('codigo_postal');
    const rfcInput = document.getElementById('rfc');
    const razonSocialInput = document.getElementById('razon_social');
    const submitButton = document.querySelector('.submit-button');
    
    // Add an event listener for when the postal code field loses focus
    codigoPostalInput.addEventListener('blur', function() {
        validateRFC();
    });
    
    // Function to validate RFC using VerificaMEX API
    async function validateRFC() {
        if (!rfcInput.value || !razonSocialInput.value || !codigoPostalInput.value) {
            return;
        }
        
        try {
            showValidationMessage('Validando RFC con el SAT...', 'warning');
            
            const requestData = {
                rfc: rfcInput.value.trim(),
                razon_social: razonSocialInput.value.trim(),
                codigo_postal: codigoPostalInput.value.trim()
            };
            
            const response = await fetch('https://api.verificamex.com/identity/v1/miscellaneous/sat/rfc_extended', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTkwNmQwMTczMTcyZTY0MzE0NWI0ZDNhMTI0NjFmMzkwYzg1YTBjNmRiY2QwZTc5ODcwMGM3MzMzYTk4YThiNGJiZTkyZmNhMzFmZTA3ZDQiLCJpYXQiOjE3NDE3Mjk5MzcuNDk5MDQ3LCJuYmYiOjE3NDE3Mjk5MzcuNDk5MDY4LCJleHAiOjE3NzMyNjU5MzcuNDg4Nzc5LCJzdWIiOiI1MTIxIiwic2NvcGVzIjpbXX0.cmutxhBli-ZyQB-ZUSwXQriwqbYoZSktslniamI7AAH4kWvswPJNPRNP7IsfQdBCLp5E4ZwNUJScNR1MXYHf5D-eZUBdwJmxtAT0W1McuaZpO_RW92g4fw_Pdk8KLOywNt7rrnNJ2N9krOy_nDLn3pDQ66kdwSgyUHOxe8syWNjlxq16Q_BOqzQMbY6aSGObL88KXN2jExQ4IiRa0diiV4yFMub-kWwDdsihpkEfa5EJncFCiPKlEFYhcIQ89ORPSeZ30b8a95eoTSm_8aZqDINXbPu-Sh4C1Sa46FOekNJIMcVNOohEakuTycMyohoPi0_GvX8JIUnvh5NEfW8xkMGTcvlyK_5vmKNgiRBkxDIjeweJ2tenO4X18slCaLA-UTCUs3_tEB0F0AzlMwimSSW5M4xBxn7oPAWR6Voe3lwGPflytpfIeowrRQf0_XaSRlaA1Q21g5x4y0ZJyoAE-yXyJrHzGQorQofh3oT9aOsOo0UqlLMm8l-npalbHsWPV5BVBgNHVgS5eKSJOmTM34dplewxHDGjmITtOROyzs5h5SoFpYtrsxizkxfapMhH724GzWJlet0VE7qvguFBz_gso-AePtyWOkHo1QCOePxxmDB9IcqBBc1Jv690zRzjdPifvJ85lCmvwXPRO1XnMBxVF5iRH1M4rXOgBrlYeyo'
                },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.data && data.data.status === true) {
                    showValidationMessage('RFC validado correctamente con el SAT', 'success');
                    enableSubmitButton();
                } else {
                    showValidationMessage('El RFC no coincide con la Razón Social o Código Postal registrados en el SAT', 'danger', 'https://api.verificamex.com/docs');
                    disableSubmitButton();
                }
            } else {
                showValidationMessage('El RFC no está registrado en el SAT o no existe', 'danger', 'https://api.verificamex.com/docs');
                disableSubmitButton();
            }
        } catch (error) {
            console.error('Error validating RFC:', error);
            showValidationMessage('Error al validar el RFC. Por favor, intente nuevamente.', 'danger', 'https://api.verificamex.com/support');
            disableSubmitButton();
        }
    }
    
    // Function to show validation message with optional URL
    function showValidationMessage(message, type, url = null) {
        const existingMessage = document.getElementById('rfc-validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.id = 'rfc-validation-message';
        messageElement.className = `alert alert-${type} mt-2 custom-alert`;
        
        // Message content
        const messageText = document.createElement('span');
        messageText.textContent = message;
        messageElement.appendChild(messageText);
        
        // If there's a URL, add a toggleable link icon
        if (url) {
            const linkContainer = document.createElement('span');
            linkContainer.className = 'link-container';
            
            const linkIcon = document.createElement('i');
            linkIcon.className = 'fas fa-link link-icon'; // Using Font Awesome for the icon
            linkContainer.appendChild(linkIcon);
            
            const urlElement = document.createElement('span');
            urlElement.className = 'url-text';
            urlElement.textContent = url;
            urlElement.style.display = 'none'; // Hidden by default
            
            linkContainer.appendChild(urlElement);
            messageElement.appendChild(linkContainer);
            
            // Toggle URL visibility on icon click
            linkIcon.addEventListener('click', function() {
                urlElement.style.display = urlElement.style.display === 'none' ? 'inline' : 'none';
            });
        }
        
        rfcInput.closest('.floating-input').appendChild(messageElement);
    }
    
    // Function to disable submit button
    function disableSubmitButton() {
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }
    
    // Function to enable submit button
    function enableSubmitButton() {
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
    }
    
    // Add validation when fields change
    rfcInput.addEventListener('input', function() {
        const existingMessage = document.getElementById('rfc-validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    });
    
    razonSocialInput.addEventListener('input', function() {
        const existingMessage = document.getElementById('rfc-validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    });
    
    // Initialize - disable submit button until validated
    disableSubmitButton();
    
    // Add form submission validation
    document.querySelector('form').addEventListener('submit', function(event) {
        const validationMessage = document.getElementById('rfc-validation-message');
        if (!validationMessage || !validationMessage.classList.contains('alert-success')) {
            event.preventDefault();
            showValidationMessage('Por favor, valide el RFC antes de continuar', 'warning');
        }
    });
});