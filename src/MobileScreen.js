var MobileScreen = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        ResourceManager.addSpriteFramesResource("item");

        this.arr_reel1 = [];
        // this.setSpriteFrame(res.HelloWorld_png);
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        var fixed_width = 18;

        var mainscene = ccs.load(res.layer_mobile_json);
        var bg_reel = mainscene.node
        bg_reel.anchorX = 0.5;
        bg_reel.anchorY = 0.5;
        bg_reel.x = cc.winSize.width/2;
        bg_reel.y = cc.winSize.height/2;
        bg_reel.setScale(getScaleToFitImageToWinSize(bg_reel.getContentSize()));
        this.addChild(bg_reel);
        cc.log(size)
        
        //load config
        this.config = {};
        this.config.row = 3;
        this.config.col = 5;
        
        var yun_1 = bg_reel.getChildByName("top");
        yun_1.setLocalZOrder(1000);
        var yun_2 = bg_reel.getChildByName("bot");
        yun_2.setLocalZOrder(1000);
        var spin_btn = bg_reel.getChildByName("btn_spin");
        spin_btn.setLocalZOrder(1000);
        spin_btn.addTouchEventListener(this.onSpinSelect.bind(this));
        
        var top_bg = bg_reel.getChildByName("top_bg");
        top_bg.setLocalZOrder(900);

        var mid_bg = bg_reel.getChildByName("mid_bg");
        
        var bot_bg = bg_reel.getChildByName("bot_bg");
        bot_bg.setLocalZOrder(900);



        this.columns = [];
        for(var i = 0;i<this.config.col;i++){
            var config = {};
            config.num_row = this.config.row;
            config.distance = 82 ;
            config.wait_time = 0.2*i;
            var col = new Column(config);
            var x = 78.3 * i + 38;
            var y = bg_reel.height * 0.4264;
            var pos = cc.p(x,y)
            col.anchorX = 0;
            col.setPosition(pos);
            bg_reel.addChild(col,5)
            this.columns.push(col);
            // break;
        }

        return true;
    },
    getResultRender: function(){
        var flag = true;
        for(var i = 0;i<this.config.col;i++){
            flag = flag && !this.columns[i].getAction();
        }
        if(flag){
            for(var i = 0;i<this.config.col;i++){
                this.columns[i].renderResult();
            }
            this.unschedule(this.getResultRender)
        }
    },
    onSpinSelect: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                var flag = true;
                for(var i = 0;i<this.config.col;i++){
                    flag = flag && !this.columns[i].getAction();
                }
                if(flag){
                    for(var i = 0;i<this.config.col;i++){
                        this.columns[i].spinReel();
                    }
                    this.schedule(this.getResultRender, 1);
                }     
                break;
            default:
                break;
        }
    },
    addBackground:function()
    {
        var bg = new cc.Sprite(res.HelloWorld_png);
        bg.anchorX = 0.5;
        bg.anchorY = 0.5;
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        if (height>800){
            height = 800;
        }

        bg.x = width / 2;
        bg.y = height / 2;
        bg.scale = 0.5;
        // bg.width = cc.winSize.width;
        // bg.height = cc.winSize.width;
        this.addChild(bg);
    }
});