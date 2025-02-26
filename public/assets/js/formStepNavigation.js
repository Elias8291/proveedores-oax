document.addEventListener('DOMContentLoaded', function() {
    const hasSection1Errors = document.querySelectorAll('#section1 .text-danger').length > 0;
    const hasSection2Errors = document.querySelectorAll('#section2 .text-danger').length > 0;

    if (hasSection1Errors || hasSection2Errors) {
        if (hasSection2Errors) {
            document.getElementById('section1').style.display = 'none';
            document.getElementById('section2').style.display = 'block';
        } else {
            document.getElementById('section1').style.display = 'block';
            document.getElementById('section2').style.display = 'none';
        }

        const firstError = hasSection2Errors ? document.querySelector('#section2 .text-danger') : document.querySelector('#section1 .text-danger');
        if (firstError) {
            const firstErrorInput = firstError.closest('.floating-input').querySelector('input, select');
            if (firstErrorInput) {
                firstErrorInput.focus();
                firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});
