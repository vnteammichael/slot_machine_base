var LOADING_JSON = "res/LoadingScreen.json";
var BG_LOADING = "res/bg_loading.jpg";
var SCALE = {
    "pc":0.27,
    "mobile":0.59
}

var LoaderScene = cc.Scene.extend({
    ctor: function (resources) {
        this._super();
        this.resources = resources;
        this.loaded = 0;
        this.backGround;
        this.progressBar;
        
    },
    init: function () {
        // var size = cc.winSize;
        // var mainscene = ccs.load(LOADING_JSON);
        // var bg_reel = mainscene.node
        // bg_reel.anchorX = 0.5;
        // bg_reel.anchorY = 0.5;
        // bg_reel.x = cc.winSize.width/2;
        // bg_reel.y = cc.winSize.height/2;
        // bg_reel.setScale(0.2);
        // // bg_reel.setScale(getScaleToFitImageToWinSize(bg_reel.getContentSize()));
        // this.addChild(bg_reel);
        // this.progressBar = bg_reel.getChildByName('loading_bar');

        var size = cc.winSize;
        var scale = SCALE["pc"];
        this.backGround = new cc.Sprite(BG_LOADING);
        this.addChild(this.backGround);
        this.backGround.setAnchorPoint(cc.p(0.5, 0.5));
        this.backGround.setPosition(size.width / 2, size.height / 2);
        if (cc.sys.isMobile){
            scale = SCALE["mobile"];
        }
        this.backGround.setScale(scale);


        this.loadingBarBG = new cc.Sprite("res/loading_bar_bg.png");
        this.loadingBarBG.setPosition(cc.p(size.width / 2, size.height / 5));
        this.addChild(this.loadingBarBG);
        this.loadingBarBG.setScale(scale);

        
        // this.progressBar = new cc.ProgressTimer(new cc.Sprite("res/loading_bar.png"));
        // this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        // this.progressBar.setMidpoint(cc.p(0, 0));
        // this.progressBar.setBarChangeRate(cc.p(1, 0));
        // this.progressBar.setPercentage(100);
        // // this.progressBar.setVisible(true);
        // // this.progressBar.setOpacity(255); // Fully opaque    
        // this.progressBar.setPosition(size.width / 2, size.height / 2);
        // this.progressBar.setAnchorPoint(cc.p(0.5, 0.5));
        // // this.addChild(this.progressBar);
        // this.addChild(this.progressBar);
        // this.progressBar.setScale(scale);

        this.progressBar = new ccui.LoadingBar();
        this.progressBar.loadTexture("res/loading_bar.png");
        this.progressBar.setAnchorPoint(cc.p(0.5, 0.5));
        this.progressBar.setPercent(0);    
        this.progressBar.setPosition(size.width / 2, size.height / 5);
        this.addChild(this.progressBar);
        this.progressBar.setScale(scale);

        
         

        
    },
    onEnter: function () {
        this._super();
        this.init();
        this.loadResources();
    },
    loadResources: function () {
        var self = this;
        var totalResources = this.resources.length;



        var updateProgressBar = function (percentage) {
            // console.log(this.progressBar.getPosition())
            self.progressBar.setPercent(percentage);
        };

        // Loading function
        var loadNext = function () {
            if (self.loaded < totalResources) {
                var resource = self.resources[self.loaded];
                cc.loader.load(resource, function (err) {
                    if (!err) {
                        self.loaded++;
                        updateProgressBar((self.loaded / (totalResources + 1)) * 100);
                        loadNext();  // Load the next resource
                        // sleep(1000);
                    }
                });
            } else {
                // All resources are loaded
                self.onResourcesLoaded();
            }
        };

        // Start loading
        loadNext();
    }, 
    onResourcesLoaded: function () {

        if (gv.gameclient.isConnected) {
            // gv.gameclient.send(JSON.stringify({"cmd":1000,"data":{"token":1}}));
            ActionMapping.dispatch(LoginAction,{"token":gv.USER_ID,"game_code":"001"})
        }


        // GameGUIManager.getSceneOrCreate(MainScene);
        // var transition = new cc.TransitionFade(1, new MainScene());

        // cc.director.runScene(transition); // Transition to the game scene
    }
});
