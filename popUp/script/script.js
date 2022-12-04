console.log('PopUp is running');

// Botones para el formulario
let submitBtn = document.getElementById('submitBtn');
let forgotBtn = document.getElementById('forgotBtn');

//  Base de URL para las peticiones axios
// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://20.102.59.206:8080';

//  Comprobar que sea un email valido
const checkEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

//  Comprobar contraseña valida
const checkPassword = (password) => {
    return password && true;
    // return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password);
};

//  Verificar el contenido de los inputs antes de enviar al background
const checkInputs = (email, password) => {
    let validInformation = true;

    if (!checkEmail(email)) {
        removeErrorEmail();
        validInformation = false;
    } else {
        addErrorEmail();
    }

    if (!checkPassword(password)) {
        removeErrorPass();
        validInformation = false;
    } else {
        addErrorPass();
    }

    return validInformation;
};


//  Iniciar sesión con una cuenta de tutor
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    addWrongCredential();

    if (checkInputs(email, password)) {
        getTodoItems({
            email,
            password,
        });
    }
});

//  Verfificar e iniciar sesion
const getTodoItems = async (loginData) => {
    try {
        console.log(loginData);
        const resultado = await axios.post(`${BASE_URL}/login`, loginData);
        console.log(resultado.data);
        let credential = {
            token: resultado.data.token,
            user: resultado.data.user,
        };
        sendCredentialToBackground(credential);
    } catch (errors) {
        console.log(errors);
        removeWrongCredential();
    }
};

// Envia las credenciales al background y espera su respuesta para mostrar el mensaje correspondiente
const sendCredentialToBackground = (credential) => {
    chrome.runtime.sendMessage(
        {
            type: 'CREDENTIAL',
            credential,
        },
        (response) => {
            if (response) {
                extensionActiva();
            } else {
                extensionNoActiva();
            }
        }
    );
};

// Recibir mensajes
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const login = document.getElementById('login');
    const msgWrongCredential = document.getElementById('msgWrongCredential');
    const msgError = document.getElementById('msgError');
    const msgActive = document.getElementById('msgActiva');

    //  Mensaje del background indicando si las credenciales son correctas
    if (msg.type === 'connection-error') {
        extensionErrorDeConexion();
    }
    if (msg.type === 'connection-active') {
        let user = localStorage.getItem('user');
        let token = localStorage.getItem('token');

        if (user && token) {
            extensionActiva();
        } else {
            extensionNoActiva();
        }
    }
});

// Verificar el estado de la extension
const estadoDeExtension = () => {
    chrome.runtime.sendMessage(
        {
            type: 'VERIFICAR_EXTENSION',
        },
        (response) => {
            if (response) {
                extensionActiva();
            } else {
                extensionNoActiva();
            }
        }
    );
};

estadoDeExtension();
