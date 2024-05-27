
var gv = gv || {};

var LoginAction = Action.extend({
    ctor: function (info) {
        this._super(info);
    },

    // override these functions
    getActionName: function () {
        return LoginAction;
    },

    doAction: function () {
        // var valid_amount = this.info.valid_amount;
        // var status = this.info.status;
        gv.token = this.info.token
        // ActionMapping.dispatch(InitInfoAction,{"token":gv.token})
        GameGUIManager.view(MainScene);
        // //set điểm
        // var currentScene = GameGUIManager.getCurrentScreen();
        // var currentLayer = currentScene.getChildByName('layer');
    
        GameGUIManager.scene.MainGUI.layer.setLabelUserScore(Math.floor(this.info.valid_amount * 100)/100);
        GameGUIManager.scene.MainGUI.layer.txt_mid.setString(convertNumberToString(0.0));
        // return this.info
    },
    checkAction: function () {
        var doneAction = true;


        
        return doneAction;
    }
});       