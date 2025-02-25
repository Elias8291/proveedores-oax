document.addEventListener('DOMContentLoaded', function() {
    // Check for validation errors in both forms
    const hasRegisterErrors = document.querySelectorAll('#registerForm .text-danger').length > 0;
    const hasLoginErrors = document.querySelectorAll('#loginForm .text-danger').length > 0;

    if (hasRegisterErrors || hasLoginErrors) {
        const registerTab = document.querySelector('#register-tab');
        const loginTab = document.querySelector('#login-tab');
        const registerTabInstance = new bootstrap.Tab(registerTab);
        const loginTabInstance = new bootstrap.Tab(loginTab);
        
        // Show the appropriate tab based on where the error is found
        if (hasLoginErrors) {
            loginTabInstance.show();
        } else {
            registerTabInstance.show();
        }

        // Focus on the first error field
        const firstError = hasLoginErrors ? document.querySelector('#loginForm .text-danger') : document.querySelector('#registerForm .text-danger');
        const firstErrorInput = firstError.previousElementSibling.querySelector('input, select');
        firstErrorInput.focus();
        firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Navigation functions for the multi-step form
function nextSection() {
    document.getElementById('section1').style.display = 'none';
    document.getElementById('section2').style.display = 'block';
}

function prevSection() {
    document.getElementById('section2').style.display = 'none';
    document.getElementById('section1').style.display = 'block';
}