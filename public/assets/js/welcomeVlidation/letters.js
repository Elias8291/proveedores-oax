document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('#section1 input');
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.back-button'); // Cambiamos a .back-button según tu HTML

    const expressions = {
        text: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s]{1,49}$/,
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/,
    };

    const fields = {
        name: false,
        last_name: false,
        second_last_name: true, // Opcional, no bloquea por defecto
        email: false,
        email_confirmation: false,
    };

    const convertText = (input) => {
        if (input.name !== 'email' && input.name !== 'email_confirmation') {
            input.value = input.value.toUpperCase();
        }
    };

    const validateField = (expression, input, field) => {
        input.value = input.value.trimStart();
        convertText(input);
        let isValid;

        if (field === 'email_confirmation') {
            const emailValue = document.getElementById('email').value;
            isValid = input.value === emailValue && expressions.email.test(input.value);
        } else if (field === 'second_last_name') {
            isValid = input.value === '' ? true : expressions.text.test(input.value);
        } else {
            isValid = expression.test(input.value);
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
            name: value === '' ? 'El nombre es obligatorio.' : 'El nombre debe tener entre 2 y 50 letras sin espacios al inicio.',
            last_name: value === '' ? 'El primer apellido es obligatorio.' : 'El primer apellido debe tener entre 2 y 50 letras sin espacios al inicio.',
            second_last_name: value === '' ? '' : 'El segundo apellido debe tener entre 2 y 50 letras sin espacios al inicio si se llena.',
            email: value === '' ? 'El correo electrónico es obligatorio.' : 'El correo electrónico no tiene un formato válido.',
            email_confirmation: value === '' ? 'La confirmación del correo es obligatoria.' : 'La confirmación debe coincidir con el correo electrónico.',
        };
        return messages[fieldName] || 'Este campo es obligatorio o tiene un formato incorrecto.';
    };

    const restrictCharacters = (input, expression) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(expression, '');
        });
    };

    const validateForm = (e) => {
        const { name } = e.target;
        convertText(e.target);

        const validations = {
            name: () => {
                restrictCharacters(e.target, /[^a-zA-ZÀ-ÿ\s]/g);
                validateField(expressions.text, e.target, 'name');
            },
            last_name: () => {
                restrictCharacters(e.target, /[^a-zA-ZÀ-ÿ\s]/g);
                validateField(expressions.text, e.target, 'last_name');
            },
            second_last_name: () => {
                restrictCharacters(e.target, /[^a-zA-ZÀ-ÿ\s]/g);
                validateField(expressions.text, e.target, 'second_last_name');
            },
            email: () => {
                validateField(expressions.email, e.target, 'email');
            },
            email_confirmation: () => {
                validateField(null, e.target, 'email_confirmation');
            },
        };

        if (validations[name]) validations[name]();
    };

    const validateAllFields = () => {
        inputs.forEach(input => {
            validateForm({ target: input });
        });
        return Object.keys(fields).every(field => fields[field] === true);
    };

    inputs.forEach(input => {
        if (input.value) convertText(input);
        input.addEventListener('keyup', validateForm);
        input.addEventListener('blur', validateForm);
    });

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateAllFields()) {
                nextSection();
            } else {
                const firstErrorField = document.querySelector('.is-invalid');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            prevSection();
        });
    }

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

    function nextSection() {
        document.getElementById('section1').style.display = 'none';
        document.getElementById('section2').style.display = 'block';
    }

    function prevSection() {
        document.getElementById('section2').style.display = 'none';
        document.getElementById('section1').style.display = 'block';
    }
});