var ActionMapping = ActionMapping || {};

ActionMapping._createAction = function (actionType, info) {
    var actionCmd;
    // console.log(SpinAction)
    // TODO: actionType factory
    switch (actionType) {
        case LoginAction:
            actionCmd = {"cmd":gv.CMD.LOGIN,"data":info}
            break;
        case InitInfoAction:
            actionCmd = {"cmd":gv.CMD.INIT_INFO,"data":info}
            break;
        case SpinAction:
            actionCmd = {"cmd":gv.CMD.SPIN,"data":info}
            break;
        
        default:
            // cc.log("Can not parse actionCmd:", actionType);
    }

    // cc.log(JSON.stringify(info));
    return actionCmd;
};

ActionMapping.dispatch = function (actionType, info) {
    if (ActionFactory.checkAction(actionType, info)) {
        var data = ActionMapping._createAction(actionType, info);
        // cc.log("-----sent Action-----", data);
        if (data) {
            var pk = JSON.stringify(data)
            gv.gameclient.send(pk);
        }
    }
}

ActionMapping.saveTempAction = function (action) {
    ActionMapping._tempAction = action;
}

ActionMapping.dispatchTempAction = function () {
    if (ActionMapping._tempAction) {
        var action = ActionMapping._tempAction;
        ActionMapping._tempAction = undefined;

        ActionMapping.dispatch(action.getActionName(), action.info);
    }
}