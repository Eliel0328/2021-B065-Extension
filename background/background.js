console.log('background is running');

// Direccion de servidor
const socket = io('http://localhost:8080/');
// const socket = io('http://20.102.59.206:8080/');

//  Variables de usuario
let usuario = null;
let token = null;
let active = false;

//      Mensajes de socket io

// Enviar un mensaje para mostrar un error en el emergente
socket.on('connect_error', (err) => {
    sendResponseToPopUp('connection-error', {});
});

// Enviar un mensaje para mostrar un estado activo en el emergente
socket.on('connect', function () {
    sendResponseToPopUp('connection-active', {});

    if (token && usuario) {
        socket.emit('mensaje-bienvenida', {
            user: usuario,
        });
    }
    
});

// Enviar el texto usando socket.io al servidor web
const sendText = (msg) => {
    socket.emit('mensaje-cliente', {
        token: token,
        contenido: msg.contenido,
        fechaHora: msg.fecha_hora,
        url: msg.url,
        idTutor: usuario.id,
        dominio: msg.dominio,
    });
};

// Obtener del localstorage la informacion del usuario
const setConfig = () => {
    token = JSON.parse(localStorage.getItem('token'));
    usuario = JSON.parse(localStorage.getItem('user'));

    if (token && usuario) {
        active = true;
    } else {
        active = false;
    }
};

const sendResponseToPopUp = (typeMsg, response) => {
    chrome.runtime.sendMessage({ type: typeMsg, response });
};

// Verificar que la extension este activa
const verificarExtensionActiva = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    let token = JSON.parse(localStorage.getItem('token'));
    if (user && token) {
        return true;
    } else {
        return false;
    }
};

// Recibir mensajes
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // Mensaje del content
    // Se recibe el texto y se verifica que este activa la extension para enviar el texto al servidor
    if (msg.type === 'TEXT') {
        console.log('Received %o from %o, frame', msg, sender.tab, sender.frameId);
        sendResponse('Text Gotcha!');
        setConfig();

        if (active) {
            sendText(msg);
        }
    }

    //  Mensaje del PopUp
    // Indica la direccion y es permitido enviar la informacion al servidor
    else if (msg.type === 'CREDENTIAL') {
        const { token, user } = msg.credential;
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(user));

        setConfig();
        sendResponse(true);

        socket.emit('mensaje-bienvenida', {
            user,
        });
    }

    //   Mensaje del PopUp
    //  Verificar que la extension este activa
    else if (msg.type === 'VERIFICAR_EXTENSION') {
        sendResponse(verificarExtensionActiva());
    }

    //  Otro mensaje
    else {
        console.log('Other\nReceived %o from %o, frame', msg, sender.tab, sender.frameId);
    }
});

setConfig();
