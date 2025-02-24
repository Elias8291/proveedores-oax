// Function to handle form validation errors
document.addEventListener('DOMContentLoaded', function() {
    // Check for any validation errors
    const hasErrors = document.querySelectorAll('.text-danger').length > 0;
    
    if (hasErrors) {
        // Switch to register tab
        const registerTab = document.querySelector('#register-tab');
        const registerTabInstance = new bootstrap.Tab(registerTab);
        registerTabInstance.show();
        
        // Find the first error
        const firstError = document.querySelector('.text-danger');
        const firstErrorInput = firstError.previousElementSibling.querySelector('input, select');
        
        // Determine which section contains the error
        const errorSection = firstErrorInput.closest('div[id^="section"]');
        
        // Show the correct section
        document.getElementById('section1').style.display = 'none';
        document.getElementById('section2').style.display = 'none';
        errorSection.style.display = 'block';
        
        // Focus on the first error field
        firstErrorInput.focus();
        
        // Smooth scroll to the error
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