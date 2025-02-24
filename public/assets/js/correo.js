document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    let emailCheckTimeout;

    // Current email validation function
    const validateEmail = (input) => {
        clearError(input);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            showError(input, 'El correo electrónico no es válido. Asegúrate de incluir un "@" y un dominio.');
            return false;
        }
        return true;
    };

    // Function to check if email exists
    const checkEmailExists = (email) => {
        // Clear any previous errors
        clearError(emailInput);
        
        // Only proceed if the email is valid
        if (!validateEmail(emailInput)) {
            return;
        }
        
        // Show loading indicator
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'email-loading-spinner';
        loadingSpinner.innerHTML = '<small class="text-muted"><i class="fas fa-spinner fa-spin"></i> Verificando...</small>';
        
        // Add loading indicator after the input group
        const inputGroup = emailInput.closest('.input-group');
        let existingSpinner = inputGroup.parentNode.querySelector('.email-loading-spinner');
        
        if (existingSpinner) {
            existingSpinner.remove();
        }
        
        inputGroup.parentNode.insertBefore(loadingSpinner, inputGroup.nextSibling);
        
        // Make AJAX request to check if email exists
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
            // Remove loading spinner
            loadingSpinner.remove();
            
            if (data.exists) {
                showError(emailInput, 'Este correo electrónico ya está registrado. Por favor utiliza otro.');
            }
        })
        .catch(error => {
            // Remove loading spinner
            loadingSpinner.remove();
            console.error('Error al verificar el correo:', error);
        });
    };

    // Modify the email input event listener to include debounced email existence check
    emailInput.addEventListener('input', () => {
        validateEmail(emailInput);
        validateConfirmEmail(confirmEmailInput);
        
        // Clear the previous timeout
        clearTimeout(emailCheckTimeout);
        
        // Set a new timeout (debounce)
        emailCheckTimeout = setTimeout(() => {
            if (emailInput.value.trim() !== '') {
                checkEmailExists(emailInput.value);
            }
        }, 500); // Wait for 500ms after the user stops typing
    });

    // Add blur event to immediately check when user leaves the field
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() !== '' && validateEmail(emailInput)) {
            clearTimeout(emailCheckTimeout);
            checkEmailExists(emailInput.value);
        }
    });
});