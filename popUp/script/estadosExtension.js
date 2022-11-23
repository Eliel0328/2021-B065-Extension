const login = document.getElementById('login');
const msgWrongCredential = document.getElementById('msgWrongCredential');
const msgError = document.getElementById('msgError');
const msgActive = document.getElementById('msgActiva');

const msgWrongEmail = document.getElementById('msgWrongEmail');
const msgWrongPassword = document.getElementById('msgWrongPassword');

const extensionActiva = () => {
    // Ocultar formulario
    // Ocultar mensajes de error
    // Mostrar mensaje de extension activa
    msgActive.classList.remove('d-none');
    login.classList.add('d-none');
    msgError.classList.add('d-none');
    msgWrongCredential.classList.add('d-none');
};

const extensionNoActiva = () => {
    // Mostrar formulario
    // Mostrar mensajes de error
    // Ocultar mensaje de extension activa
    login.classList.remove('d-none');
    msgError.classList.add('d-none');
    msgActive.classList.add('d-none');
    msgWrongCredential.classList.add('d-none');
};

const extensionErrorDeConexion = () => {
    // Ocultar formulario
    // Ocultar mensajes de error
    // Mostrar mensaje de error de conexion
    msgError.classList.remove('d-none');
    login.classList.add('d-none');
    msgActive.classList.add('d-none');
    msgWrongCredential.classList.add('d-none');
};

const removeErrorEmail = () => {
    msgWrongEmail.classList.remove('d-none');
};

const addErrorEmail = () => {
    msgWrongEmail.classList.add('d-none');
};

const removeErrorPass = () => {
    msgWrongPassword.classList.remove('d-none');
};

const addErrorPass = () => {
    msgWrongPassword.classList.add('d-none');
};

const removeWrongCredential = () => {
    msgWrongCredential.classList.remove('d-none');
};

const addWrongCredential = () => {
    msgWrongCredential.classList.add('d-none');
};
