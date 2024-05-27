
var gv = gv || {};

var ReconnectAction = Action.extend({
    ctor: function (info) {
        this._super(info);
    },

    // override these functions
    getActionName: function () {
        return ReconnectAction;
    },

    doAction: function () {
        // var valid_amount = this.info.valid_amount;
        // var status = this.info.status;
        if (this.info.status){
            gv.gameclient.connect("ws://192.168.120.30:8080");
        }else{
            
        }
    },
    checkAction: function () {
        var doneAction = true;


        
        return doneAction;
    }
});        