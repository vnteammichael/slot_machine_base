var Action = cc.Class.extend({
    ctor: function (info) {
        this.info = info;
    },

    getActionCode: function () {
        return ActionFactory.ACTION_CODE[this.getActionName()];
    },
    // override these functions
    getActionName: function () {
        return Action;
    },

    // TODO: override this function
    doAction: function () {
    },
    checkAction: function () {
    }
});