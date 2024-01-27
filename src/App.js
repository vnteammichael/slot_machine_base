function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        ResourceManager.addSpriteFramesResource("item");

        this.arr_reel1 = [];

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.Layer_Spin_json);
        var bg_reel = mainscene.node
        bg_reel.anchorX = 0.5;
        bg_reel.anchorY = 0.5;
        bg_reel.x = cc.winSize.width/2;
        bg_reel.y = cc.winSize.height/2;
        bg_reel.scale = 0.32;
        this.addChild(bg_reel);
        
        //load config
        this.config = {};
        this.config.row = 1;
        this.config.col = 3;
        
        var yun_1 = bg_reel.getChildByName("yun_6");
        yun_1.setLocalZOrder(1000);
        var yun_2 = bg_reel.getChildByName("yun_6_0");
        yun_2.setLocalZOrder(1000);
        var spin_btn = bg_reel.getChildByName("Spin");
        spin_btn.setLocalZOrder(1000);
        spin_btn.addTouchEventListener(this.onSpinSelect.bind(this));


        this.columns = [];
        for(var i = 0;i<this.config.col;i++){
            var config = {};
            config.num_row = this.config.row;
            config.distance = 200;
            config.wait_time = 0.2*i;
            var col = new Column(config);
            var x = bg_reel.width * (i+1) * 1/ (this.config.col + 1);
            var y = bg_reel.height * 1/2;
            var pos = cc.p(x,y)
            col.setPosition(pos)
            bg_reel.addChild(col,5)
            this.columns.push(col);
            // col.spin_reel();
        }

        return true;
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

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
