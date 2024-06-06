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

        this.current_bet_index = 0;

        var mainscene = ccs.load(res.layer_mobile_json);
        var bg_reel = mainscene.node
        bg_reel.anchorX = 0.5;
        bg_reel.anchorY = 0.5;
        bg_reel.x = cc.winSize.width/2;
        bg_reel.y = cc.winSize.height/2;
        bg_reel.setScale(getScaleToFitImageToWinSize(bg_reel.getContentSize()));
        this.addChild(bg_reel);

        
        //load config
        this.config = {};
        this.config.row = 3;
        this.config.col = 5;
        
        var top_layer = bg_reel.getChildByName("top_layer");
        top_layer.setLocalZOrder(1000);
        var bot_layer = bg_reel.getChildByName("bot_layer");
        bot_layer.setLocalZOrder(1000);

        var spin_btn = bg_reel.getChildByName("btn_spin");
        spin_btn.setLocalZOrder(1000);
        spin_btn.addTouchEventListener(this.onSpinSelect.bind(this));

        var btn_add = bg_reel.getChildByName("btn_add");
        btn_add.setLocalZOrder(1000);
        btn_add.addTouchEventListener(this.onAddPress.bind(this));

        var btn_reduce = bg_reel.getChildByName("btn_reduce");
        btn_reduce.setLocalZOrder(1000);
        btn_reduce.addTouchEventListener(this.onSubPress.bind(this));

        var btn_auto = bg_reel.getChildByName("btn_auto");
        btn_auto.setLocalZOrder(1000);
        // spin_btn.addTouchEventListener(this.onSpinSelect.bind(this));
        
        var btn_turbo = bg_reel.getChildByName("btn_turbo");
        btn_turbo.setLocalZOrder(1000);


        var credit_bg = bot_layer.getChildByName("credit_bg");
        credit_bg.setLocalZOrder(905);
        this.txt_left = credit_bg.getChildByName("txt_left");
        this.txt_mid = credit_bg.getChildByName("txt_mid");
        this.txt_right = credit_bg.getChildByName("txt_right");


        this.columns = [];
        for(var i = 0;i<this.config.col;i++){
            var config = {};
            config.num_row = this.config.row;
            config.distance = 109 ;
            config.wait_time = 0.2*i;
            var col = new Column(config);
            var x = 82.8 * i + 49.4;
            var y = bg_reel.height * 0.5;
            var pos = cc.p(x,y)
            col.anchorX = 0;
            col.setPosition(pos);
            bg_reel.addChild(col,5)
            this.columns.push(col);
            // break;
        }
        
        this.setLabelBetScore(BET_VALUES[this.current_bet_index])
        this.setLabelWinScore(0.00)

        return true;
    },
    getResultRender: function(){
        var flag = true;
        for(var i = 0;i<this.config.col;i++){
            flag = flag && !this.columns[i].getAction();
        }
        if(flag){
            var delay = 0.5;
            for(var k in this.getResultRender.line_win){
                var count = 0
                for(var i = 0;i<this.config.col;i++){
                    this.columns[i].renderResult(k,delay);
                    count += 1;
                    if (count > this.getResultRender.line_win[k].consecutive){
                        break;
                    }
                }
                delay += 0.5;
            }
            this.unschedule(this.getResultRender);
        }
    },
    onSpinSelect: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                

                ActionMapping.dispatch(SpinAction,{"token":gv.token,"bet":BET_VALUES[this.current_bet_index]})

                // var array = ["scatter"];
                // var code = array[Math.floor(Math.random() * array.length)];
                // this.item.setItemCode(code);
                break;
            default:
                break;
        }
    },
    loadAnimSpin: function(data){
        var flag = true;
        for(var i = 0;i<this.config.col;i++){
            flag = flag && !this.columns[i].getAction();
        }
        if(flag){
            for(var i = 0;i<this.config.col;i++){
                this.columns[i].spinReel();
            }
            this.getResultRender.line_win = data.line_win
            this.schedule(this.getResultRender, 1);
        }
        //set win number
        if (data.total_reward >0){
            var duration = 0.5 * Object.keys(data.line_win).length
            
            this.setLabelWinScore(data.total_reward,duration, delay = 0.5);
        }else{
            
            this.setLabelWinScore(data.total_reward);
        }
        this.setLabelUserScore(Math.floor(data.valid_amount * 100)/100);
    },
    onAddPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                this.current_bet_index += 1;
                if (this.current_bet_index >= BET_VALUES.length){
                    this.current_bet_index = 0;
                }
                this.setLabelBetScore(BET_VALUES[this.current_bet_index])
                break;
            default:
                break;
        }
    },
    onSubPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                //sub score
                this.current_bet_index -= 1;
                if (this.current_bet_index < 0){
                    this.current_bet_index = BET_VALUES.length - 1;
                }
                this.setLabelBetScore(BET_VALUES[this.current_bet_index])
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
    },
    setLabelBetScore: function(bet) 
    {
        this.txt_right.setString(convertNumberToString(bet))

    },
    setLabelWinScore: function(win, duration = 0, delay = 0) 
    {
        var numAnimation = new NumberAnimationAction(duration, 0, win); // Animate from 0 to 100 in 2 seconds
        this.txt_mid.runAction(cc.sequence(cc.delayTime(delay), numAnimation));
        this.txt_mid.setString(convertNumberToString(win))

    },
    setLabelUserScore: function(score) 
    {
        this.txt_left.setString(convertNumberToString(score))

    }
});