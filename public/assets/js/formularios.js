document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el mapa
  var map = L.map('map').setView([17.065, -96.723], 13); // Coordenadas de Oaxaca de Juárez

  // Añadir la capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Añadir un marcador
  var marker = L.marker([17.065, -96.723], {
      draggable: true
  }).addTo(map);

  // Función para obtener la dirección a partir de las coordenadas
  function getAddressFromCoordinates(lat, lng) {
      // Utilizar el servicio de geocodificación inversa de Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
              // Llenar los campos del formulario con los datos de la dirección
              fillAddressFields(data.address);
          })
          .catch(error => {
              console.error('Error al obtener la dirección:', error);
          });
  }

  // Función para llenar los campos del formulario con los datos de la dirección
  function fillAddressFields(address) {
      // Mapear los campos de la respuesta a los campos del formulario
      document.getElementById('calle').value = address.road || address.street || '';
      document.getElementById('numero').value = address.house_number || '';
      document.getElementById('colonia').value = address.suburb || address.neighbourhood || '';
      document.getElementById('codigo_postal').value = address.postcode || '';
      document.getElementById('ciudad').value = address.city || address.town || address.village || '';
      document.getElementById('estado').value = address.state || '';

      // Actualizar el campo de búsqueda con una versión formateada de la dirección
      let formattedAddress = [
          address.road,
          address.house_number,
          address.suburb,
          address.city || address.town || address.village,
          address.state
      ].filter(Boolean).join(', ');
      
      document.getElementById('buscar_direccion').value = formattedAddress;
  }

  // Evento cuando se arrastra el marcador
  marker.on('dragend', function(event) {
      var position = marker.getLatLng();
      getAddressFromCoordinates(position.lat, position.lng);
  });

  // Evento al hacer clic en el mapa
  map.on('click', function(e) {
      // Mover el marcador a la posición donde se hizo clic
      marker.setLatLng(e.latlng);
      
      // Obtener la dirección de la nueva posición
      getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
  });

  // Búsqueda de dirección
  const buscarDireccionInput = document.getElementById('buscar_direccion');
  const sugerenciasContainer = document.getElementById('sugerencias');

  buscarDireccionInput.addEventListener('input', function() {
      const query = this.value;
      if (query.length > 3) {
          // Buscar direcciones que coincidan con la consulta
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
              .then(response => response.json())
              .then(data => {
                  // Mostrar sugerencias
                  sugerenciasContainer.innerHTML = '';
                  data.forEach(result => {
                      const sugerencia = document.createElement('div');
                      sugerencia.className = 'sugerencia-item';
                      sugerencia.textContent = result.display_name;
                      sugerencia.addEventListener('click', function() {
                          // Actualizar el mapa y el marcador
                          map.setView([result.lat, result.lon], 16);
                          marker.setLatLng([result.lat, result.lon]);
                          
                          // Llenar los campos de dirección
                          getAddressFromCoordinates(result.lat, result.lon);
                          
                          // Limpiar y ocultar sugerencias
                          buscarDireccionInput.value = result.display_name;
                          sugerenciasContainer.innerHTML = '';
                      });
                      sugerenciasContainer.appendChild(sugerencia);
                  });
              })
              .catch(error => {
                  console.error('Error en la búsqueda de direcciones:', error);
              });
      } else {
          sugerenciasContainer.innerHTML = '';
      }
  });

  // Ocultar sugerencias al hacer clic fuera
  document.addEventListener('click', function(e) {
      if (e.target !== buscarDireccionInput && !sugerenciasContainer.contains(e.target)) {
          sugerenciasContainer.innerHTML = '';
      }
  });
  
  // Get all form sections
  const formSections = document.querySelectorAll('.form-section');
  // Get progress steps
  const progressSteps = document.querySelectorAll('.progress-step');
  // Get navigation buttons
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  const submitBtn = document.querySelector('.btn-submit');
  const resetBtn = document.querySelector('.btn-reset');
  
  // Initialize current step
  let currentStep = 0;
  
  // Hide all sections except the first one
  for (let i = 1; i < formSections.length; i++) {
    formSections[i].style.display = 'none';
  }
  
  // Hide previous button initially
  prevBtn.style.display = 'none';
  
  // Show appropriate buttons based on current step
  function updateButtons() {
    // Show/hide previous button
    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }
    
    // Show/hide next button and submit button
    if (currentStep === formSections.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.parentElement.style.display = 'flex';
    } else {
      nextBtn.style.display = 'block';
      submitBtn.parentElement.style.display = 'none';
    }
  }
  
  // Update progress tracker
  function updateProgressTracker() {
    // Remove active class from all steps
    progressSteps.forEach((step, index) => {
      step.classList.remove('active');
      step.classList.remove('completed');
      
      if (index < currentStep) {
        step.classList.add('completed');
      } else if (index === currentStep) {
        step.classList.add('active');
      }
    });
  }
  
  // Handle next button click
  nextBtn.addEventListener('click', function() {
    if (currentStep < formSections.length - 1) {
      // Hide current section
      formSections[currentStep].style.display = 'none';
      // Increment current step
      currentStep++;
      // Show next section
      formSections[currentStep].style.display = 'block';
      // Update buttons and progress tracker
      updateButtons();
      updateProgressTracker();
      // Scroll to top of form
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Handle previous button click
  prevBtn.addEventListener('click', function() {
    if (currentStep > 0) {
      // Hide current section
      formSections[currentStep].style.display = 'none';
      // Decrement current step
      currentStep--;
      // Show previous section
      formSections[currentStep].style.display = 'block';
      // Update buttons and progress tracker
      updateButtons();
      updateProgressTracker();
      // Scroll to top of form
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Handle reset button click
  resetBtn.addEventListener('click', function() {
    // Reset to first step
    currentStep = 0;
    // Hide all sections except the first one
    for (let i = 0; i < formSections.length; i++) {
      formSections[i].style.display = i === 0 ? 'block' : 'none';
    }
    // Update buttons and progress tracker
    updateButtons();
    updateProgressTracker();
  });



  function nextStep(currentStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + (currentStep + 1)).classList.add('active');
    
    // Update progress steps
    const steps = document.querySelectorAll('.step');
    steps[currentStep - 1].classList.add('completed');
    steps[currentStep].classList.add('active');
    steps[currentStep - 1].classList.remove('active');
}

function prevStep(currentStep) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + (currentStep - 1)).classList.add('active');
    
    // Update progress steps
    const steps = document.querySelectorAll('.step');
    steps[currentStep - 1].classList.remove('active');
    steps[currentStep - 2].classList.add('active');
    steps[currentStep - 2].classList.remove('completed');
}

// Mock map initialization (would be replaced with actual map API)
function initMap() {
    // Placeholder for map initialization
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = '<div style="display: flex; height: 100%; align-items: center; justify-content: center; background-color: #f5ede4; color: #6c5a4c;">Mapa de ubicación</div>';
    }
}

// Initialize the map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Form submission handler
    document.getElementById('tramites-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Formulario enviado correctamente!');
    });
});
});