document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('#section-1 input, #section-1 select, #section-2 input, #section-2 select, #section-3 input, #section-3 select');

    const expresiones = {
        letrasYEspacios: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
        alfanumerico: /^[a-zA-Z0-9\s]{1,50}$/,
        nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
        curp: /^[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[A-Z0-9]{2}$/,
        telefono: /^\d{7,14}$/,
        correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA0-9-.]+$/,
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        codigo_postal: /^\d{5}$/,
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

    const validarCampo = (expresion, input, campo) => {
        const esValido = expresion.test(input.value);
        campos[campo] = esValido;
        mostrarOcultarError(input, esValido);
    };

    const mostrarOcultarError = (input, esValido) => {
        const grupo = input.closest('.form-group');
        if (!grupo) return;

        let errorElement = grupo.querySelector('.formulario__input-error');
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.classList.add('formulario__input-error');
            grupo.appendChild(errorElement);
        }

        errorElement.textContent = esValido ? '' : 'Este campo es obligatorio o tiene un formato incorrecto.';
        errorElement.style.display = esValido ? 'none' : 'block';
        input.classList.toggle('is-invalid', !esValido);
        input.classList.toggle('is-valid', esValido);
    };

    const validarFormulario = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'contacto_nombre':
                validarCampo(expresiones.nombre, e.target, 'contacto_nombre');
                break;
            case 'curp':
                validarCampo(expresiones.curp, e.target, 'curp');
                break;
            case 'contacto_telefono':
                validarCampo(expresiones.telefono, e.target, 'contacto_telefono');
                break;
            case 'contacto_correo':
                validarCampo(expresiones.correo, e.target, 'contacto_correo');
                break;
            case 'contacto_web':
                validarCampo(expresiones.url, e.target, 'contacto_web');
                break;
            case 'sector':
                campos.sector = value.trim() !== '';
                mostrarOcultarError(e.target, campos.sector);
                break;
            case 'actividad_comercial':
                campos.actividad_comercial = value.trim() !== '';
                mostrarOcultarError(e.target, campos.actividad_comercial);
                break;
            case 'contacto_cargo':
                campos.contacto_cargo = expresiones.letrasYEspacios.test(value.trim());
                mostrarOcultarError(e.target, campos.contacto_cargo);
                break;
            case 'codigo_postal':
                campos.codigo_postal = expresiones.codigo_postal.test(value);
                mostrarOcultarError(e.target, campos.codigo_postal);
                break;
            case 'estado':
            case 'municipio':
            case 'colonia':
                campos[name] = expresiones.letrasYEspacios.test(value.trim());
                mostrarOcultarError(e.target, campos[name]);
                break;
            case 'calle':
            case 'numero_exterior':
            case 'numero_interior':
            case 'entre_calle_1':
            case 'entre_calle_2':
                campos[name] = expresiones.alfanumerico.test(value.trim());
                mostrarOcultarError(e.target, campos[name]);
                break;
            case 'numero_escritura':
                campos.numero_escritura = expresiones.alfanumerico.test(value.trim());
                mostrarOcultarError(e.target, campos.numero_escritura);
                break;
            case 'nombre_notario':
                campos.nombre_notario = expresiones.letrasYEspacios.test(value.trim());
                mostrarOcultarError(e.target, campos.nombre_notario);
                break;
            case 'entidad_federativa':
                campos.entidad_federativa = expresiones.letrasYEspacios.test(value.trim());
                mostrarOcultarError(e.target, campos.entidad_federativa);
                break;
            case 'fecha_constitucion':
                campos.fecha_constitucion = value.trim() !== '';
                mostrarOcultarError(e.target, campos.fecha_constitucion);
                break;
            case 'numero_notario_2':
                campos.numero_notario_2 = expresiones.alfanumerico.test(value.trim());
                mostrarOcultarError(e.target, campos.numero_notario_2);
                break;
            case 'numero_registro':
                campos.numero_registro = expresiones.alfanumerico.test(value.trim());
                mostrarOcultarError(e.target, campos.numero_registro);
                break;
            case 'fecha_inscripcion':
                campos.fecha_inscripcion = value.trim() !== '';
                mostrarOcultarError(e.target, campos.fecha_inscripcion);
                break;
        }
    };

    const restringirCaracteres = (e) => {
        const { name, value } = e.target;
        let regex;

        switch (name) {
            case 'contacto_nombre':
            case 'contacto_cargo':
            case 'nombre_notario':
            case 'entidad_federativa':
            case 'estado':
            case 'municipio':
            case 'colonia':
                regex = /[^a-zA-ZÀ-ÿ\s]/g;
                break;
            case 'curp':
                regex = /[^A-Z0-9]/g;
                break;
            case 'contacto_telefono':
            case 'codigo_postal':
            case 'numero_notario_2':
            case 'numero_registro':
                regex = /[^0-9]/g;
                break;
            case 'contacto_correo':
                regex = /[^a-zA-Z0-9_.+-@]/g;
                break;
            case 'contacto_web':
                regex = /[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/g;
                break;
            default:
                return;
        }

        if (regex) {
            e.target.value = value.replace(regex, '');
        }
    };

    const convertirAMayusculas = (e) => {
        e.target.value = e.target.value.toUpperCase();
    };

    inputs.forEach(input => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
        input.addEventListener('input', restringirCaracteres);
        input.addEventListener('input', convertirAMayusculas);
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', validarFormulario);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .formulario__input-error {
            color: red;
            font-size: 0.8rem;
            margin-top: 0.2rem;
            display: none;
        }
        .is-invalid {
            border-color: red !important;
        }
        .is-valid {
            border-color: green !important;
        }
    `;
    document.head.appendChild(style);
});