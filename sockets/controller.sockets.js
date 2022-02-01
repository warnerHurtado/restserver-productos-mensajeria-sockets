const { validateJWTsocket } = require("../helpers/generate-jwt");
const MessagesChat          = require('../models/chat');

const messagesChat = new MessagesChat();

const socketController = async ( socket, io ) => {

    const user = await validateJWTsocket( socket.handshake.headers['x-token'] );

    if ( !user ){
        return socket.disconnect();
    }

    //Agregar al usuario conectado
    messagesChat.connectUser( user );
    //Aqui no uso el broadcast porque estoy usando el io que es para todos
    io.emit( 'active-users', messagesChat.arrUsers );
    socket.emit( 'recibe-message', messagesChat.lasts10 ); //Para la persona que se reconecta le lleguen los msjs

    //Conectarlo a una sala especial
    socket.join( user.id ); //tiene salas: global, socketId, userId

    // Limpiar cuando alguien se desconecte
    socket.on( 'discconect', ()=> {
        messagesChat.disconnectUser( user.id )
        io.emit( 'active-users', messagesChat.arrUsers ); // Le emito a todos nuevamente la lista de conectados
    })
    
    //Envio de mensajes
    socket.on( 'send-message', ({ uid, message}) => {

        if ( uid ){
            //mensaje privado
            socket.to( uid ).emit('receive-privateMessage', { from: user.name, message });
        }else{

            //mensaje publico
            messagesChat.sendMessage( user.id, user.name, message );
            io.emit( 'recibe-message', messagesChat.lasts10 );
        }
        
    })
    
    
}

module.exports = {
    socketController
}