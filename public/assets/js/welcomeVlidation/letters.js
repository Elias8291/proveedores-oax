document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const pdfInput = document.getElementById('constancia_fiscal');
    const emailInput = document.getElementById('email');
    const emailConfirmationInput = document.getElementById('email_confirmation');

    const expressions = {
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/,
    };

    const fields = {
        constancia_fiscal: false,
        email: false,
        email_confirmation: false,
    };

    const validateField = (input, field) => {
        let isValid;

        if (field === 'constancia_fiscal') {
            isValid = input.files.length > 0 && input.files[0].type === 'application/pdf';
        } else if (field === 'email') {
            isValid = expressions.email.test(input.value);
        } else if (field === 'email_confirmation') {
            const emailValue = document.getElementById('email').value;
            isValid = input.value === emailValue && expressions.email.test(input.value);
        }

        fields[field] = isValid;
        showHideError(input, isValid);
    };

    const showHideError = (input, isValid) => {
        const group = input.closest('.floating-input');
        if (!group) return;
        let errorElement = group.querySelector('.formulario__input-error') || document.createElement('p');
        errorElement.classList.add('formulario__input-error');
        group.appendChild(errorElement);
        errorElement.textContent = isValid ? '' : getErrorMessage(input.name, input.value);
        errorElement.style.display = isValid ? 'none' : 'block';
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid && input.value !== '');
    };

    const getErrorMessage = (fieldName, value) => {
        const messages = {
            constancia_fiscal: value === '' ? 'Debes subir un archivo PDF.' : 'El archivo debe ser un PDF.',
            email: value === '' ? 'El correo electrónico es obligatorio.' : 'El correo electrónico no tiene un formato válido.',
            email_confirmation: value === '' ? 'La confirmación del correo es obligatoria.' : 'La confirmación debe coincidir con el correo electrónico.',
        };
        return messages[fieldName] || 'Este campo es obligatorio o tiene un formato incorrecto.';
    };

    const validateForm = (e) => {
        const { name } = e.target;

        const validations = {
            constancia_fiscal: () => {
                validateField(e.target, 'constancia_fiscal');
            },
            email: () => {
                validateField(e.target, 'email');
            },
            email_confirmation: () => {
                validateField(e.target, 'email_confirmation');
            },
        };

        if (validations[name]) validations[name]();
    };

    const validateAllFields = () => {
        validateField(pdfInput, 'constancia_fiscal');
        validateField(emailInput, 'email');
        validateField(emailConfirmationInput, 'email_confirmation');
        return Object.keys(fields).every(field => fields[field] === true);
    };

    pdfInput.addEventListener('change', validateForm);
    emailInput.addEventListener('keyup', validateForm);
    emailInput.addEventListener('blur', validateForm);
    emailConfirmationInput.addEventListener('keyup', validateForm);
    emailConfirmationInput.addEventListener('blur', validateForm);

    form.addEventListener('submit', (e) => {
        if (!validateAllFields()) {
            e.preventDefault();
            const firstErrorField = document.querySelector('.is-invalid');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
        }
    });
});