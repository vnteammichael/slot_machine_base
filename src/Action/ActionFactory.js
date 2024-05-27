var ActionFactory = ActionFactory || {};

ActionFactory._createAction = function (actionType, info) {
    var action;

    // TODO: actionType factory
    switch (actionType) {
        case LoginAction:
            action = new LoginAction(info)
            break;
        case InitInfoAction:
            action = new InitInfoAction(info)
            break;
        case SpinAction:
            action = new SpinAction(info)
            break;
        default:
            cc.log("Can not parse action:", actionType);
    }

    return action;
};

ActionFactory.createAction = function (actionType, info) {
    cc.log("-------------Do Action-------------", info);

    var action = ActionFactory._createAction(actionType, info);

    if (action) {
        // client do
        action.doAction();
    }
}

ActionFactory.checkAction = function (actionType, info) {
    cc.log("-------------Check Action-------------", info);

    var action = ActionFactory._createAction(actionType, info);

    if (action) {
        // client do
        return action.checkAction();
    }
    else
        return null;
}

