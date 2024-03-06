let WebSocket = window.WebSocket || WebSocket ||  window.MozWebSocket;


var GameClient = cc.Class.extend({
    ctor: function () {
        this.socket;

        // this.connect("ws://localhost:8080");
        // let keepAliveInterval = setInterval(() => {
        //     if (this.socket.readyState === WebSocket.OPEN) {
        //         this.socket.send(JSON.stringify({ type: "ping" }));
        //     }
        // }, 30000);
    },
    connect: function(url) {
        console.log("Attempting to connect to WebSocket server at", url);
        this.socket = new WebSocket(url);

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    },

    // Handle open event
    onOpen: function() {
        cc.log("Connection opened.");
        this.isConnected = true;
        cc.log(this.socket)
        // Additional open event logic here
        // this.socket.send(JSON.stringify({"cmd":1000,"data":{"user_id":1}}));
    },

    // Handle incoming messages
    onMessage: function(event) {
        console.log("Message received:", event.data);
        let inPacket = new InPacket();
        inPacket.receiveMessage(event.data);
        // Process the message
        // Depending on the structure of your messages, you might
        // have different handling logic based on the cmdId or other data.
    },

    // Send a message to the server
    send: function(message) {
        if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            cc.error("Cannot send message, WebSocket is not connected.");
        }
        // this.socket.send(message);
    },

    // Handle error event
    onError: function(event) {
        cc.error("WebSocket error:", event);
        // Error handling logic here
    },

    // Handle close event
    onClose: function(event) {
        this.socket.onclose = () => {
            clearInterval(keepAliveInterval);
        };
        cc.log("Connection closed.");
        this.isConnected = false;
        // Clean-up logic here
    },

    // Disconnect from the server
    disconnect: function() {
        if (this.socket) {
            this.socket.close();
        }
    },

    // Ensure proper cleanup on destruction
    onDestroy: function() {
        this.disconnect();
    }

});