document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('email_confirmation');

    let emailCheckTimeout;
    let isEmailDuplicate = false;

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

    const clearError = (input) => {
        let error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.remove();
        }
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

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const isEmailValid = validateEmail(emailInput);
            const isConfirmEmailValid = validateConfirmEmail(confirmEmailInput);
            const isEmailUnique = await checkEmailExists(emailInput.value);

            if (!isEmailValid || !isConfirmEmailValid || isEmailDuplicate) {
                if (!isEmailValid || isEmailDuplicate) emailInput.focus();
                else confirmEmailInput.focus();
                return;
            }

            form.submit();
        });
    }
});