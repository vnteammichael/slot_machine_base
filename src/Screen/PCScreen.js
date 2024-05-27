var PCScreen = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        ResourceManager.addSpriteFramesResource("item");

        var size = cc.winSize;
        var fixed_width = 18;

        this.current_bet_index = 0;

        var mainscene = ccs.load(res.layer_pc_json);
        var bg_reel = mainscene.node
        bg_reel.anchorX = 0.5;
        bg_reel.anchorY = 0.5;
        bg_reel.x = cc.winSize.width/2;
        bg_reel.y = cc.winSize.height/2;
        // bg_reel.setScale(0.45);
        // bg_reel.setScale(getScaleToFitImageToWinSize(bg_reel.getContentSize()));
        this.addChild(bg_reel);

        
        //load config
        this.config = {};
        this.config.row = 3;
        this.config.col = 5;
        
        var yun_1 = bg_reel.getChildByName("top");
        yun_1.setLocalZOrder(1000);
        var yun_2 = bg_reel.getChildByName("bot");
        yun_2.setLocalZOrder(1000);
        
        var top_bg = bg_reel.getChildByName("top_bg");
        top_bg.setLocalZOrder(900);

        var mid_bg = bg_reel.getChildByName("mid_bg");
        
        var bot_bg = bg_reel.getChildByName("bot_bg");
        bot_bg.setLocalZOrder(900);

        var bg_panel_left = bg_reel.getChildByName("bg_panel_left");
        bg_panel_left.setLocalZOrder(905);
        this.label_left = bg_panel_left.getChildByName("label_left");
        this.txt_left = bg_panel_left.getChildByName("txt_left");

        var bg_panel_mid = bg_reel.getChildByName("bg_panel_mid");
        bg_panel_mid.setLocalZOrder(905);
        this.label_mid = bg_panel_mid.getChildByName("label_mid");
        this.txt_mid = bg_panel_mid.getChildByName("txt_mid");

        var bg_panel_right = bg_reel.getChildByName("bg_panel_right");
        bg_panel_right.setLocalZOrder(905);
        this.label_right = bg_panel_right.getChildByName("label_right");
        this.txt_right = bg_panel_right.getChildByName("txt_right");


        //button
        
        this.spin_btn = bg_reel.getChildByName("btn_spin");
        this.spin_btn.setLocalZOrder(1000);
        this.spin_btn.addTouchEventListener(this.onSpinSelect.bind(this));

        this.btn_add = bg_reel.getChildByName("btn_add");
        this.btn_add.setLocalZOrder(1000);
        this.btn_add.addTouchEventListener(this.onAddPress.bind(this));

        this.btn_reduce = bg_reel.getChildByName("btn_reduce");
        this.btn_reduce.setLocalZOrder(1000);
        this.btn_reduce.addTouchEventListener(this.onSubPress.bind(this));

        this.columns = [];
        for(var i = 0;i<this.config.col;i++){
            var config = {};
            config.num_row = this.config.row;
            config.distance = 37 ;
            config.wait_time = 0.2*i;
            var col = new Column(config);
            var x = 35 * i + 170;
            var y = bg_reel.height * 0.42;
            var pos = cc.p(x,y)
            col.anchorX = 0;
            col.setPosition(pos);
            bg_reel.addChild(col,5)
            this.columns.push(col);
            // col.spin_reel();
        }
        
        this.setLabelBetScore(BET_VALUES[this.current_bet_index])
        

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
        // this.txt_mid.setString(convertNumberToString(win))

    },
    setLabelUserScore: function(score) 
    {
        this.txt_left.setString(convertNumberToString(score))

    }
});