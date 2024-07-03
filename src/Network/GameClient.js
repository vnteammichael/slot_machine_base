let WebSocket = window.WebSocket || WebSocket ||  window.MozWebSocket;


var GameClient = cc.Class.extend({
    ctor: function () {
        this.socket;
        
        this._serverName;
        this._port;
        this._url;
        this.loadConfig();

    },
    loadConfig: function () {
        var fileName = res.ip_config;
        cc.loader.loadJson(fileName, (err, data) => {
            if (err) {
                return cc.log("load failed");
            } else {
                this._serverName = data['server'];
                this._port = data['port'];
                this._url = "ws://"+this._serverName+":" + this._port
            }
        });
        cc.log(this._url)
        
    },
    connect: function() {
        console.log("Attempting to connect to WebSocket server at", this._url);
        this.socket = new WebSocket(this._url);

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    },

    // Handle open event
    onOpen: function() {
        cc.log("Connection opened.");
        this.isConnected = true;
        // Additional open event logic here
        // this.socket.send(JSON.stringify({"cmd":1000,"data":{"user_id":1}}));
    },

    // Handle incoming messages
    onMessage: function(event) {
        // console.log("Message received:", event);
        data = JSON.parse(event.data)
        console.log("Message received:", data);
        switch(data.cmd){
            case gv.CMD.LOGIN:
                ActionFactory.createAction(LoginAction,data.data);
                break; 
            case gv.CMD.INIT_INFO:
                ActionFactory.createAction(InitInfoAction,data.data);
                break; 
            
            case gv.CMD.SPIN:
                ActionFactory.createAction(SpinAction,data.data);
                break; 
        }
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
        GameGUIManager.scene.MainGUI.layer.popup(1);
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