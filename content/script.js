console.log('Content Script is Running');

//  Variables para comparar el contenido
let originalText = 'orig';

//  Funcion para limpiar contenido usando expresiones regulares
const separarContenido = (text) => {
    // Quitar pesos, fechas, horas, caracteres especiales
    let aux = text.replace(
        /(\$|MXN)\s?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?(\s?MXN)?[\s\.\,]?/gm,
        ''
    );
    aux = aux.replace(
        /\d{4}([\-/.])(0?[1-9]|1[1-2])([\-/.])(3[01]|[12][0-9]|0?[1-9])[,\.\s]?/gm,
        ''
    );
    aux = aux.replace(/([01]?[0-9]|2[0-3]):[0-5][0-9]\s?(?:[aApP](\.?)[mM]\.)?/gm, '');
    aux = aux.replace(/[^\w\s.!@%^&*ñÑáéíóúÁÉÍÓÚ()\-\/]+/gm, '');

    // Separar por saltos de linea, puntos, punto y coma
    aux = aux.split(/[\n\.;]+/);

    // Eliminar contenido vacio
    let aux1 = aux.filter((element) => {
        return element !== '';
    });

    // Eliminar espacios iniciales y finales
    const aux2 = aux1.map((element) => {
        return element.trim();
    });

    // Quitar longitudes 1
    let aux3 = aux2.filter((element) => {
        return element.length > 1;
    });

    let aux4 = aux3.filter((element) => {
        return element.split(' ').length >= 5;
    });

    return aux4
};

//  Funcion para enviar el texto al background
const sentTextToBackground = (text) => {
    if (text.length > 0) {
        let msg = {
            type: 'TEXT',
            text: text,
            contenido: separarContenido(text),
            url: window.location.href,
            fecha_hora: new Date(),
            dominio: window.location.hostname.replace('www.', ''),
        };
        chrome.runtime.sendMessage(msg, (response) => {
            console.log('Response: ', response);
        });
    }
};

//  Funcion que separa el texto de cada pagina que se visita
const getTextFromPage = (newText) => {
    //  Comprobar si se trata del mismo texto
    if (newText.normalize() === originalText.normalize()) {
        console.log('El mismo contenido');
    } else {
        sentTextToBackground(newText);
    }
    //  Actualizar contenido
    originalText = newText;
};

//  Funcion/evento para cada clic
document.onclick = function (event) {
    // Compensate for IE<9's non-standard event model
    if (event === undefined) event = window.event;
    var target = 'target' in event ? event.target : event.srcElement;

    getTextFromPage(document.body.innerText);
};

getTextFromPage(document.body.innerText);
