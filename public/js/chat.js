
const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth/'
    : 'https://rest-server-node-warner.herokuapp.com/api/auth/';

let user   = null;
let socket = null;

// Referencias HTML

const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem( 'token' ) || '';

    if (token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en la aplicación');
    }

    const res = await fetch( url, {
        headers: {'x-token': token }
    });

    const { user: userDB,  token: tokenDB } = await res.json();

    localStorage.setItem('token', tokenDB);
    document.title = userDB.name;
    user = userDB;

    await socketConnect();
    

}

const socketConnect = async () => {
    socket = io({
         'extraHeaders':{
             'x-token': localStorage.getItem('token')
         }
    });

    socket.on('connect', () => {
        console.log('sockets online');
    });

    socket.on('disconnect', ()=> {
        console.log('sockets offline');
        
    });

    socket.on('recibe-message', drawMessages );
    socket.on('active-users'  , drawUsers );

    socket.on('receive-privateMessage', drawPrivateMessage);
}

const drawUsers = ( users = [] ) => {

    let usersHTML = '';
    users.forEach( ({ name, uid }) => {

        usersHTML += `
        <li>
            <p>
                <h5 class="text-success"> ${ name } </h5>
                <span class="fs-6 text-muted" > ${ uid } </span>
            </p>
        </li>
        `
    });

    ulUsuarios.innerHTML += usersHTML;
}

const drawMessages = ( messages = [] ) => {

    let messagesHTML = '';
    messages.forEach( ({ name, message }) => {

        messagesHTML += `
        <li>
            <p>
                <span class="text-primary "> ${ name } </span>
                <span > ${ message } </span>
            </p>
        </li>
        `
    });

    ulMensajes.innerHTML = messagesHTML;
}

const drawPrivateMessage = ( { from, message} ) => {

    const messagesHTML = `
        <li>
            <p>
                <span class="text-success "> <small>Private</small> ${ from }: </span>
                <span > ${ message } </span>
            </p>
        </li>
        `;

    ulMensajes.innerHTML = messagesHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => { 

    const message = txtMensaje.value;
    const uid     = txtUid.value;

    if ( keyCode !== 13 ) return;
    if ( message.length === 0 ) return;

    socket.emit( 'send-message', { message, uid });

    txtMensaje.value = '';
})

const main = async() => {
     
    await validarJWT();
}

main();

