document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
   const inputs = document.querySelectorAll('#section-1 input, #section-1 select, #section-2 input, #section-2 select, #section-3 input, #section-3 select');
    const actividadesSeleccionadas = document.getElementById('actividades_seleccionadas');
    const actividadesInput = document.getElementById('actividades_comerciales_input');

    const expresiones = {
        letrasYEspacios: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
        alfanumerico: /^[a-zA-Z0-9\s]{1,50}$/,
        nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        curp: /^[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[A-Z0-9]{2}$/,
        telefono: /^\d{7,14}$/,
        correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        codigo_postal: /^\d{5}$/
    };

    const campos = {
        contacto_nombre: false,
        curp: true,
        contacto_telefono: false,
        contacto_correo: false,
        contacto_web: true,
        sector: false,
        actividad_comercial: false,
        contacto_cargo: false,
        codigo_postal: false,
        estado: false,
        municipio: false,
        colonia: false,
        calle: false,
        numero_exterior: false,
        numero_interior: true,
        entre_calle_1: true,
        entre_calle_2: true,
        numero_escritura: false,
        nombre_notario: false,
        entidad_federativa: false,
        fecha_constitucion: false,
        numero_notario_2: false,
        numero_registro: false,
        fecha_inscripcion: false
    };

    const camposMinuscula = ['contacto_correo', 'contacto_web'];
    const camposSinModificar = ['colonia'];

    const restriccionesCaracteres = {
        letrasYEspacios: /[^a-zA-ZÀ-ÿ\s]/g,
        numeros: /\D/g,
        alfanumerico: /[^a-zA-Z0-9\s]/g
    };

    const convertirTexto = (input) => {
        if (camposSinModificar.includes(input.name)) return;
        input.value = camposMinuscula.includes(input.name) ? input.value.toLowerCase() : input.value.toUpperCase();
    };

    const validarCampo = (expresion, input, campo) => {
        convertirTexto(input);
        const esValido = expresion ? expresion.test(input.value) : input.value.trim() !== '';
        campos[campo] = esValido;
        mostrarOcultarError(input, esValido);
    };

    const mostrarOcultarError = (input, esValido) => {
        const grupo = input.closest('.form-group');
        if (!grupo) return;
        let errorElement = grupo.querySelector('.formulario__input-error') || document.createElement('p');
        errorElement.classList.add('formulario__input-error');
        grupo.appendChild(errorElement);
        errorElement.textContent = esValido ? '' : 'Este campo es obligatorio o tiene un formato incorrecto.';
        errorElement.style.display = esValido ? 'none' : 'block';
        input.classList.toggle('is-invalid', !esValido);
        input.classList.toggle('is-valid', esValido);
    };

    const restringirCaracteres = (input, expresion) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(expresion, '');
        });
    };

    const validarActividades = () => {
        const actividades = actividadesSeleccionadas.querySelectorAll('.actividad-item');
        const esValido = actividades.length > 0;
        campos['actividad_comercial'] = esValido;
        actividadesInput.classList.toggle('is-invalid', !esValido);
        actividadesInput.classList.toggle('is-valid', esValido);
    };

    const validarFormulario = (e) => {
        const { name, value } = e.target;
        convertirTexto(e.target);

        const validaciones = {
            contacto_nombre: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.nombre, e.target, 'contacto_nombre');
            },
            curp: () => validarCampo(expresiones.curp, e.target, 'curp'),
            contacto_telefono: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.numeros);
                validarCampo(expresiones.telefono, e.target, 'contacto_telefono');
            },
            contacto_correo: () => validarCampo(expresiones.correo, e.target, 'contacto_correo'),
            contacto_web: () => validarCampo(expresiones.url, e.target, 'contacto_web'),
            sector: () => validarCampo(null, e.target, 'sector'),
            actividad_comercial: () => validarActividades(),
            contacto_cargo: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.letrasYEspacios, e.target, 'contacto_cargo');
            },
            codigo_postal: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.numeros);
                validarCampo(expresiones.codigo_postal, e.target, 'codigo_postal');
            },
            estado: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.letrasYEspacios, e.target, 'estado');
            },
            municipio: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.letrasYEspacios, e.target, 'municipio');
            },
            colonia: () => validarCampo(expresiones.letrasYEspacios, e.target, 'colonia'),
            calle: () => validarCampo(expresiones.alfanumerico, e.target, 'calle'),
            numero_exterior: () => validarCampo(expresiones.alfanumerico, e.target, 'numero_exterior'),
            numero_interior: () => validarCampo(expresiones.alfanumerico, e.target, 'numero_interior'),
            entre_calle_1: () => validarCampo(expresiones.alfanumerico, e.target, 'entre_calle_1'),
            entre_calle_2: () => validarCampo(expresiones.alfanumerico, e.target, 'entre_calle_2'),
            numero_escritura: () => validarCampo(expresiones.alfanumerico, e.target, 'numero_escritura'),
            nombre_notario: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.letrasYEspacios, e.target, 'nombre_notario');
            },
            entidad_federativa: () => {
                restringirCaracteres(e.target, restriccionesCaracteres.letrasYEspacios);
                validarCampo(expresiones.letrasYEspacios, e.target, 'entidad_federativa');
            },
            fecha_constitucion: () => validarCampo(null, e.target, 'fecha_constitucion'),
            numero_notario_2: () => validarCampo(expresiones.alfanumerico, e.target, 'numero_notario_2'),
            numero_registro: () => validarCampo(expresiones.alfanumerico, e.target, 'numero_registro'),
            fecha_inscripcion: () => validarCampo(null, e.target, 'fecha_inscripcion')
        };

        if (validaciones[name]) validaciones[name]();
    };

    inputs.forEach(input => {
        if (input.type !== 'select-one' && input.value) convertirTexto(input);
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
        if (input.tagName === 'SELECT') input.addEventListener('change', validarFormulario);
    });

    actividadesInput.addEventListener('change', validarActividades);
});