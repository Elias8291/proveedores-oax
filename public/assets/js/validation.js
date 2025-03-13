document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const lastNameInput = document.getElementById('last_name');
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('email_confirmation');
    const rfcInput = document.getElementById('rfc');
    const razonSocialInput = document.getElementById('razon_social');
    const tipoPersonaInput = document.getElementById('tipo_persona');
    const secondLastNameInput = document.getElementById('second_last_name');
    const codigoPostalInput = document.getElementById('codigo_postal');

    let emailCheckTimeout;
    let isEmailDuplicate = false;
    let rfcCheckTimeout;
    let isRFCDuplicate = false;

    const preventNumbers = (event) => {
        if (/\d/.test(event.key)) {
            event.preventDefault();
        }
    };

    nameInput.addEventListener('keypress', preventNumbers);
    lastNameInput.addEventListener('keypress', preventNumbers);

    nameInput.addEventListener('paste', (event) => {
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        if (/\d/.test(pasteData)) {
            event.preventDefault();
        }
    });

    lastNameInput.addEventListener('paste', (event) => {
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        if (/\d/.test(pasteData)) {
            event.preventDefault();
        }
    });

    const showError = (input, message) => {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('div');
            error.className = 'error-message';
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
        error.style.color = 'red';
    };

    secondLastNameInput.addEventListener('keypress', preventNumbers);
    secondLastNameInput.addEventListener('paste', (event) => {
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        if (/\d/.test(pasteData)) {
            event.preventDefault();
        }
    });

    const validateSecondLastName = (input) => {
        clearError(input);
        if (input.value.trim() !== '') {
            const regex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/;
            if (!regex.test(input.value)) {
                showError(input, 'El segundo apellido debe contener solo letras y tener al menos 2 caracteres.');
                return false;
            }
        }
        return true;
    };

    const convertSecondLastNameToUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    secondLastNameInput.addEventListener('input', convertSecondLastNameToUpperCase);

    const clearError = (input) => {
        let error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.remove();
        }
    };

    const validateName = (input) => {
        clearError(input);
        const regex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/;
        if (!regex.test(input.value)) {
            showError(input, 'El nombre debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        return true;
    };

    const validateLastName = (input) => {
        clearError(input);
        const regex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/;
        if (!regex.test(input.value)) {
            showError(input, 'El apellido debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        return true;
    };

    const validateEmail = (input) => {
        clearError(input);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            showError(input, 'El correo electrónico no es válido. Asegúrate de incluir un "@" y un dominio.');
            return false;
        }
        return true;
    };

    const checkEmailExists = (email) => {
        return new Promise((resolve, reject) => {
            clearError(emailInput);
            if (!validateEmail(emailInput)) {
                resolve(false);
                return;
            }

            const loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'email-loading-spinner';
            loadingSpinner.innerHTML = '<small class="text-muted"><i class="fas fa-spinner fa-spin"></i> Verificando...</small>';
            const inputGroup = emailInput.closest('.input-group');
            let existingSpinner = inputGroup.parentNode.querySelector('.email-loading-spinner');
            if (existingSpinner) existingSpinner.remove();
            inputGroup.parentNode.insertBefore(loadingSpinner, inputGroup.nextSibling);

            fetch('/check-email-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                loadingSpinner.remove();
                if (data.exists) {
                    showError(emailInput, 'Este correo electrónico ya está registrado para otro usaurio. Por favor utiliza otro.');
                    isEmailDuplicate = true;
                    resolve(false);
                } else {
                    isEmailDuplicate = false;
                    resolve(true);
                }
            })
            .catch(error => {
                loadingSpinner.remove();
                console.error('Error al verificar el correo:', error);
                reject(error);
            });
        });
    };

    const validateConfirmEmail = (input) => {
        clearError(input);
        if (input.value !== emailInput.value) {
            showError(input, 'Los correos electrónicos no coinciden.');
            return false;
        }
        return true;
    };

    const validateRFC = (input) => {
        clearError(input);
        const rfcRegexFisica = /^([A-ZÑ&]{4})(\d{6})([A-Z0-9]{3})$/i;
        const rfcRegexMoral = /^([A-ZÑ&]{3})(\d{6})([A-Z0-9]{3})$/i;

        if (tipoPersonaInput.value === 'fisica') {
            if (!rfcRegexFisica.test(input.value)) {
                showError(input, 'El RFC para persona física debe tener 13 caracteres, en el formato: 4 letras, 6 dígitos y 3 caracteres alfanuméricos. Ejemplo: ABCD123456XYZ.');
                return false;
            }
        } else if (tipoPersonaInput.value === 'moral') {
            if (!rfcRegexMoral.test(input.value)) {
                showError(input, 'El RFC para persona moral debe tener 12 caracteres, en el formato: 3 letras, 6 dígitos y 3 caracteres alfanuméricos. Ejemplo: ABC123456XYZ.');
                return false;
            }
        } else {
            showError(input, 'Seleccione un tipo de persona para validar el RFC.');
            return false;
        }
        return true;
    };

    const checkRFCExists = (rfc) => {
        return new Promise((resolve, reject) => {
            clearError(rfcInput);
            if (!validateRFC(rfcInput)) {
                resolve(false);
                return;
            }

            const loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'rfc-loading-spinner';
            loadingSpinner.innerHTML = '<small class="text-muted"><i class="fas fa-spinner fa-spin"></i> Verificando RFC...</small>';
            const inputGroup = rfcInput.closest('.input-group');
            let existingSpinner = inputGroup.parentNode.querySelector('.rfc-loading-spinner');
            if (existingSpinner) existingSpinner.remove();
            inputGroup.parentNode.insertBefore(loadingSpinner, inputGroup.nextSibling);

            fetch('/check-rfc-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ rfc: rfc })
            })
            .then(response => response.json())
            .then(data => {
                loadingSpinner.remove();
                if (data.exists) {
                    showError(rfcInput, 'Este RFC ya está registrado para otro usuario. Por favor utiliza otro.');
                    isRFCDuplicate = true;
                    resolve(false);
                } else {
                    isRFCDuplicate = false;
                    resolve(true);
                }
            })
            .catch(error => {
                loadingSpinner.remove();
                console.error('Error al verificar el RFC:', error);
                reject(error);
            });
        });
    };

    const validateRazonSocial = (input) => {
        clearError(input);
        if (input.value.trim().length < 2) {
            showError(input, 'La razón social debe tener al menos 2 caracteres.');
            return false;
        }
        return true;
    };

    const validateCodigoPostal = (input) => {
        clearError(input);
        const regex = /^\d{5}$/;
        
        if (input.value.trim() === '') {
            showError(input, 'El código postal es obligatorio.');
            return false;
        } else if (!regex.test(input.value)) {
            showError(input, 'El código postal debe tener exactamente 5 dígitos numéricos.');
            return false;
        }
        return true;
    };

    codigoPostalInput.addEventListener('keypress', (event) => {
        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    });

    codigoPostalInput.addEventListener('paste', (event) => {
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        if (!/^\d+$/.test(pasteData)) {
            event.preventDefault();
        }
    });

    codigoPostalInput.addEventListener('input', () => {
        if (codigoPostalInput.value.length > 5) {
            codigoPostalInput.value = codigoPostalInput.value.slice(0, 5);
        }
        validateCodigoPostal(codigoPostalInput);
    });

    codigoPostalInput.addEventListener('blur', () => {
        validateCodigoPostal(codigoPostalInput);
    });

    const validateSection2 = () => {
        let isValid = true;
        if (tipoPersonaInput) {
            clearError(tipoPersonaInput);
            if (tipoPersonaInput.value === '') {
                showError(tipoPersonaInput, 'Debe seleccionar un tipo de persona.');
                isValid = false;
            }
        }
        if (razonSocialInput) {
            if (!validateRazonSocial(razonSocialInput)) {
                isValid = false;
            }
        }
        if (rfcInput) {
            if (!validateRFC(rfcInput)) {
                isValid = false;
            }
        }
        if (codigoPostalInput) {
            if (!validateCodigoPostal(codigoPostalInput)) {
                isValid = false;
            }
        }
        return isValid;
    };

    const convertToUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    const validateRFCWithVerificamex = async (rfc, razonSocial, codigoPostal) => {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTkwNmQwMTczMTcyZTY0MzE0NWI0ZDNhMTI0NjFmMzkwYzg1YTBjNmRiY2QwZTc5ODcwMGM3MzMzYTk4YThiNGJiZTkyZmNhMzFmZTA3ZDQiLCJpYXQiOjE3NDE3Mjk5MzcuNDk5MDQ3LCJuYmYiOjE3NDE3Mjk5MzcuNDk5MDY4LCJleHAiOjE3NzMyNjU5MzcuNDg4Nzc5LCJzdWIiOiI1MTIxIiwic2NvcGVzIjpbXX0.cmutxhBli-ZyQB-ZUSwXQriwqbYoZSktslniamI7AAH4kWvswPJNPRNP7IsfQdBCLp5E4ZwNUJScNR1MXYHf5D-eZUBdwJmxtAT0W1McuaZpO_RW92g4fw_Pdk8KLOywNt7rrnNJ2N9krOy_nDLn3pDQ66kdwSgyUHOxe8syWNjlxq16Q_BOqzQMbY6aSGObL88KXN2jExQ4IiRa0diiV4yFMub-kWwDdsihpkEfa5EJncFCiPKlEFYhcIQ89ORPSeZ30b8a95eoTSm_8aZqDINXbPu-Sh4C1Sa46FOekNJIMcVNOohEakuTycMyohoPi0_GvX8JIUnvh5NEfW8xkMGTcvlyK_5vmKNgiRBkxDIjeweJ2tenO4X18slCaLA-UTCUs3_tEB0F0AzlMwimSSW5M4xBxn7oPAWR6Voe3lwGPflytpfIeowrRQf0_XaSRlaA1Q21g5x4y0ZJyoAE-yXyJrHzGQorQofh3oT9aOsOo0UqlLMm8l-npalbHsWPV5BVBgNHVgS5eKSJOmTM34dplewxHDGjmITtOROyzs5h5SoFpYtrsxizkxfapMhH724GzWJlet0VE7qvguFBz_gso-AePtyWOkHo1QCOePxxmDB9IcqBBc1Jv690zRzjdPifvJ85lCmvwXPRO1XnMBxVF5iRH1M4rXOgBrlYeyo'; // Tu token aquí
    
        const response = await fetch('https://api.verificamex.com/identity/v1/miscellaneous/sat/rfc_extended', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                rfc: rfc,
                razon_social: razonSocial,
                codigo_postal: codigoPostal
            })
        });
    
        const data = await response.json();
    
        if (data.data.status) {
            return true; // RFC válido
        } else {
            showError(rfcInput, 'El RFC no es válido o no coincide con la Razón Social y Código Postal proporcionados.');
            return false;
        }
    };

    nameInput.addEventListener('input', convertToUpperCase);
    lastNameInput.addEventListener('input', convertToUpperCase);
    rfcInput.addEventListener('input', convertToUpperCase);
    razonSocialInput.addEventListener('input', convertToUpperCase);

    nameInput.addEventListener('input', () => validateName(nameInput));
    lastNameInput.addEventListener('input', () => validateLastName(lastNameInput));
    emailInput.addEventListener('input', () => {
        clearError(emailInput);
        validateEmail(emailInput);
        if (confirmEmailInput.value) validateConfirmEmail(confirmEmailInput);
        clearTimeout(emailCheckTimeout);
        emailCheckTimeout = setTimeout(() => {
            if (emailInput.value.trim() !== '' && validateEmail(emailInput)) {
                checkEmailExists(emailInput.value);
            }
        }, 500);
    });
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() !== '' && validateEmail(emailInput)) {
            clearTimeout(emailCheckTimeout);
            checkEmailExists(emailInput.value);
        }
    });
    confirmEmailInput.addEventListener('input', () => validateConfirmEmail(confirmEmailInput));

    if (rfcInput) {
        rfcInput.addEventListener('input', () => {
            let maxLen = tipoPersonaInput.value === 'fisica' ? 13 : (tipoPersonaInput.value === 'moral' ? 12 : 15);
            if (rfcInput.value.length > maxLen) rfcInput.value = rfcInput.value.slice(0, maxLen);
            validateRFC(rfcInput);
            clearTimeout(rfcCheckTimeout);
            rfcCheckTimeout = setTimeout(() => {
                if (rfcInput.value.trim() !== '' && validateRFC(rfcInput)) {
                    checkRFCExists(rfcInput.value);
                }
            }, 500);
        });
    }
    if (razonSocialInput) {
        razonSocialInput.addEventListener('input', () => validateRazonSocial(razonSocialInput));
    }
    if (tipoPersonaInput) {
        tipoPersonaInput.addEventListener('change', () => {
            clearError(tipoPersonaInput);
            if (tipoPersonaInput.value === '') {
                showError(tipoPersonaInput, 'Debe seleccionar un tipo de persona.');
            } else {
                rfcInput.setAttribute('maxlength', tipoPersonaInput.value === 'fisica' ? '13' : '12');
            }
            if (rfcInput) rfcInput.value = '';
            if (razonSocialInput) razonSocialInput.value = '';
        });
    }

    window.nextSection = async function() {
        const isNameValid = validateName(nameInput);
        const isLastNameValid = validateLastName(lastNameInput);
        const isEmailValid = validateEmail(emailInput);
        const isConfirmEmailValid = validateConfirmEmail(confirmEmailInput);
        const isEmailUnique = await checkEmailExists(emailInput.value);

        if (!isNameValid || !isLastNameValid || !isEmailValid || !isConfirmEmailValid || isEmailDuplicate) {
            if (!isNameValid) nameInput.focus();
            else if (!isLastNameValid) lastNameInput.focus();
            else if (!isEmailValid || isEmailDuplicate) emailInput.focus();
            else confirmEmailInput.focus();
            return;
        }

        document.getElementById('section1').style.display = 'none';
        document.getElementById('section2').style.display = 'block';
    };

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const isNameValid = validateName(nameInput);
            const isLastNameValid = validateLastName(lastNameInput);
            const isEmailValid = validateEmail(emailInput);
            const isConfirmEmailValid = validateConfirmEmail(confirmEmailInput);
            const isSection2Valid = validateSection2();
            const isEmailUnique = await checkEmailExists(emailInput.value);
            const isRFCValid = await validateRFCWithVerificamex(rfcInput.value, razonSocialInput.value, codigoPostalInput.value);

            if (!isNameValid || !isLastNameValid || !isEmailValid || !isConfirmEmailValid || !isSection2Valid || isEmailDuplicate || !isRFCValid) {
                if (!isNameValid) nameInput.focus();
                else if (!isLastNameValid) lastNameInput.focus();
                else if (!isEmailValid || isEmailDuplicate) emailInput.focus();
                else if (!isConfirmEmailValid) confirmEmailInput.focus();
                else if (!isSection2Valid) tipoPersonaInput.focus();
                else if (!isRFCValid) rfcInput.focus();
                return;
            }

            // Si todo está correcto, enviar el formulario
            form.submit();
        });
    }

    window.prevSection = function() {
        document.getElementById('section1').style.display = 'block';
        document.getElementById('section2').style.display = 'none';
    };
});