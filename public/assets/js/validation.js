document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const lastNameInput = document.getElementById('last_name');
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('email_confirmation');
    const secondLastNameInput = document.getElementById('second_last_name');

    let emailCheckTimeout;
    let isEmailDuplicate = false;

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
                    showError(emailInput, 'Este correo electrónico ya está registrado para otro usuario. Por favor utiliza otro.');
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

    const convertToUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    nameInput.addEventListener('input', convertToUpperCase);
    lastNameInput.addEventListener('input', convertToUpperCase);

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

    window.nextSection = async function() {
        const isNameValid = validateName(nameInput);
        const isLastNameValid = validateLastName(lastNameInput);
        const isEmailValid = validateEmail(emailInput);
        const isConfirmEmailValid = validateConfirmEmail(confirmEmailInput);
        const isSecondLastNameValid = validateSecondLastName(secondLastNameInput);
        const isEmailUnique = await checkEmailExists(emailInput.value);

        if (!isNameValid || !isLastNameValid || !isEmailValid || !isConfirmEmailValid || !isSecondLastNameValid || isEmailDuplicate) {
            if (!isNameValid) nameInput.focus();
            else if (!isLastNameValid) lastNameInput.focus();
            else if (!isSecondLastNameValid) secondLastNameInput.focus();
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
            const isSecondLastNameValid = validateSecondLastName(secondLastNameInput);
            const isEmailUnique = await checkEmailExists(emailInput.value);

            if (!isNameValid || !isLastNameValid || !isEmailValid || !isConfirmEmailValid || !isSecondLastNameValid || isEmailDuplicate) {
                if (!isNameValid) nameInput.focus();
                else if (!isLastNameValid) lastNameInput.focus();
                else if (!isSecondLastNameValid) secondLastNameInput.focus();
                else if (!isEmailValid || isEmailDuplicate) emailInput.focus();
                else confirmEmailInput.focus();
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