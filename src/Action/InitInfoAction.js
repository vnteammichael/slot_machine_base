
var gv = gv || {};

var InitInfoAction = Action.extend({
    ctor: function (info) {
        this._super(info);
    },

    // override these functions
    getActionName: function () {
        return InitInfoAction;
    },

    doAction: function () {
        // var valid_amount = this.info.valid_amount;
        // var status = this.info.status;
        
        var currentScene = GameGUIManager.getCurrentScreen();
        var currentLayer = currentScene.getChildByName('layer');
        
        currentLayer.setLabelUserScore(this.info.valid_amount);
        // return this.info
    },
    checkAction: function () {
        var doneAction = true;


        
        return doneAction;
    }
});       