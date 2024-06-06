var USER_ID = 0;
var LOGIN_BACKGROUND_PATH = 'res/NEN.png'

var LoginGUI = cc.Scene.extend({
    ctor: function () {
        this._super();
        // this.versionLabel = null;
        // this.idLabel = null;
        // this.textField = null;
        this.init();

        gv.gameclient.connect("ws://192.168.120.30:8080");
    },
    init: function () {
        var size = cc.winSize;

        this.backGround = new cc.Sprite(LOGIN_BACKGROUND_PATH);
        this.addChild(this.backGround);
        this.backGround.setAnchorPoint(cc.p(0.5, 0.5));
        this.backGround.setPosition(size.width / 2, size.height / 2);
        this.backGround.setScale(getScaleToFitImageToWinSize(this.backGround.getContentSize()));

    
        this.idLabel = new cc.LabelTTF("User ID");
        // this.idLabel.string = "User ID";
        this.idLabel.setPosition(size.width /2 , size.height * 23 / 40);
        // this.idLabel.setFontSize(20 * getScaleToFitImageToWinSize(this.backGround.getContentSize()));

        this.textField = new cc.EditBox(cc.size(150, 40), new cc.Scale9Sprite(), new cc.Scale9Sprite(), new cc.Scale9Sprite());;
        this.textField.setAnchorPoint(cc.p(0.5, 0.5));
        this.textField.setPlaceHolder("Enter id");
        this.textField.setPosition(size.width / 2, size.height / 2);
        

        this.addChild(this.textField, 100);
        this.addChild(this.idLabel, 2);
        // this.addChild(this.versionLabel, 1);

        const enterButton = gv.commonButton(200, 50, size.width / 2, size.height * 2 / 5, "Play");
        this.addChild(enterButton);
        enterButton.addClickEventListener(this.onPlayGame.bind(this));
        this.connector = new cc.LabelTTF("Connecting");
        this.connector.setPosition(size.width * 5 / 40, size.height * 5 / 40);
        this.connector.setFontSize(20 * getScaleToFitImageToWinSize(this.backGround.getContentSize()));
        this.addChild(this.connector);
    },

    onPlayGame: function () {

        // var pk = gv.gameClient.getOutPacket(CmdSendLogin);
        // pk.pack(this.textField.string);
        // USER_ID = this.textField.string == ""?0:this.textField.string;
        // gv.gameClient.sendPacket(pk);
        USER_ID = this.textField.string == ""?0:this.textField.string;
        if (gv.gameclient.isConnected) {
            // gv.gameclient.send(JSON.stringify({"cmd":1000,"data":{"token":1}}));
            ActionMapping.dispatch(LoginAction,{"token":USER_ID,"game_code":"a"})
        }
    },
    onFinishLogin: function () {
        cc.log("Login Successful");
        // var pk = gv.gameClient.getOutPacket(CmdSendGameInititialRequest);
        // pk.pack();
        // setTimeout(() => gv.gameClient.sendPacket(pk), 1000);
    },
    onConnectSuccess: function () {
        this.connector.string = "Connect success!";
        this.connector.setColor(cc.color(0, 255, 0));
        this.connector.setVisible(true);
    },
    onConnectFail: function () {
        this.connector.string = "Connect fail!";
        this.connector.setColor(cc.color(255, 0, 0));
        this.connector.setVisible(true);
    },
    onUserInfo: function (name, x, y) {

    }
})