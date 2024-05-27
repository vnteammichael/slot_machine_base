var GameGUIManager = GameGUIManager || {}

// scene pool
GameGUIManager.scene = {
    MainGUI: undefined,
    LoginGUI: undefined,
    LoadingGUI: undefined
};

GameGUIManager.view = function (Screen, transitionTime) {
    var scene = GameGUIManager.getSceneOrCreate(Screen);
    // check loop scene
    if (GameGUIManager.getCurrentScreen() === scene) {
        cc.log("Incoming scene must be different GameGUIManager the outgoing scene!");
        return;
    }
    if (!transitionTime) {
        transitionTime = 0.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
GameGUIManager.getCurrentScreen = function () {
    return cc.director.getRunningScene();
};
GameGUIManager.getSceneOrCreate = function (scene) {
    var s;
    switch (scene) {
        case MainScene:
            //if (GameGUIManager.scene.MainGUI === undefined) {
                GameGUIManager.scene.MainGUI = new MainScene();
            //}
            s = GameGUIManager.scene.MainGUI;
            break;
        case CampaignGUI:
            //if(GameGUIManager.scene.CampaignGUI === undefined){
                GameGUIManager.scene.LoginGUI = new LoginGUI();
            //}
            s = GameGUIManager.scene.LoginGUI;
            break;
        default:
            s = new scene();
    }
    return s;
};
