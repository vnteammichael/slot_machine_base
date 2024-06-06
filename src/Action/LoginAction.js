
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
        gv.token = this.info.token;
        GameGUIManager.view(MainScene);
        
    
        GameGUIManager.scene.MainGUI.layer.setLabelUserScore(Math.floor(this.info.valid_amount * 100)/100);
        GameGUIManager.scene.MainGUI.layer.txt_mid.setString(convertNumberToString(0.0));
        // return this.info
    },
    checkAction: function () {
        var doneAction = true;


        
        return doneAction;
    }
});       