

var SpinAction = Action.extend({
    ctor: function (info) {
        this._super(info);
    },

    // override these functions
    getActionName: function () {
        return SpinAction;
    },

    doAction: function () {
        
        // cc.log(this.info)
        //set điểm
        var currentScene = cc.director.getRunningScene();
        var currentLayer = currentScene.getChildByName('layer');
        // currentLayer.setLabelUserScore(this.info.valid_amount);
        var result = this.info.result;
        for (var i = 0;i<currentLayer.columns.length;i++){
            currentLayer.columns[i].loadResult(result[i].reverse())
        }
        currentLayer.loadAnimSpin(this.info);
    },
    checkAction: function () {
        var doneAction = true;

        
        return doneAction;
    }
});       