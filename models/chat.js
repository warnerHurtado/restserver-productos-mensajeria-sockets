

class Message  {
    constructor( uid, name, message ) {
        this.uid     = uid;
        this.name    = name;
        this.message = message;
    }
}


class MessagesChat {

    constructor (){
        this.messages = [];
        this.users    = {};
    }

    get lasts10 () {
        this.messages = this.messages.slice(0, 10);
        return this.messages;
    }

    get arrUsers () {
        return Object.values( this.users ); //Me retorna un arreglo de usuarios
    }

    sendMessage (uid, name, message) {
        this.messages.unshift( new Message(uid, name, message) );
    }

    connectUser ( user ) {
        this.users[ user.id ] = user;
    }

    disconnectUser ( id ) {
        delete this.users[ id ];
    }
}

module.exports = MessagesChat;