
var DISTANCE = {
    "pc": 45,
    "mobile": 109
}
var A_STEP_X = {
    "pc": 35,
    "mobile": 82.8
}
var B_STEP_X = {
    "pc": 170,
    "mobile": 49.4
}
var PERCENT_HEIGHT = {
    "pc": 0.47,
    "mobile":0.5
}

var TIME_SCALE= [1,3];

var PlayScreen = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        ResourceManager.addSpriteFramesResource("item");
        ResourceManager.addSpriteFramesResource("than_tai");
        
        var size = cc.winSize;
        var distance = DISTANCE["pc"];
        var a_step_x = A_STEP_X["pc"];
        var b_step_x = B_STEP_X["pc"];
        var percent_height = PERCENT_HEIGHT["pc"];
        var path = res.layer_pc_json;
        

        if (cc.sys.isMobile){
            distance = DISTANCE["mobile"];
            a_step_x = A_STEP_X["mobile"];
            b_step_x = B_STEP_X["mobile"];
            percent_height = PERCENT_HEIGHT["mobile"];
            path = res.layer_mobile_json;
        }

        this.current_bet_index = 0;
        this.time_scale_index = 0;

        var mainscene = ccs.load(path);
        this.bg_reel = mainscene.node
        this.bg_reel.anchorX = 0.5;
        this.bg_reel.anchorY = 0.5;
        this.bg_reel.x = cc.winSize.width/2;
        this.bg_reel.y = cc.winSize.height/2;
       this.addChild(this.bg_reel);

        
        //load config
        this.config = {};
        this.config.row = 3;
        this.config.col = 5;
        
        var top_layer = this.bg_reel.getChildByName("top_layer");
        top_layer.setLocalZOrder(1000);
        this.than_tai = top_layer.getChildByName('than_tai');

        var bot_layer = this.bg_reel.getChildByName("bot_layer");
        bot_layer.setLocalZOrder(1000);        
        var bg_bot = this.bg_reel.getChildByName("bg_bot");
        bg_bot.setLocalZOrder(999);


        this.panel_group_btn_1 = this.bg_reel.getChildByName("panel_group_btn_1");
        this.panel_group_btn_1.setLocalZOrder(1000);

        this.btn_spin = this.panel_group_btn_1.getChildByName("btn_spin");
        this.btn_spin.addTouchEventListener(this.onSpinSelect.bind(this));

        this.spin_icon = this.btn_spin.getChildByName("spin_icon");
        var actionBy = new cc.rotateBy(4, 360);
        var action = new cc.RepeatForever(actionBy);
        this.spin_icon.runAction(action);



        this.btn_add = this.panel_group_btn_1.getChildByName("btn_add");
        this.btn_add.addTouchEventListener(this.onAddPress.bind(this));

        this.btn_reduce = this.panel_group_btn_1.getChildByName("btn_reduce");
        this.btn_reduce.addTouchEventListener(this.onSubPress.bind(this));

        this.btn_auto = this.panel_group_btn_1.getChildByName("btn_auto");
        
        this.btn_turbo = this.panel_group_btn_1.getChildByName("btn_turbo");
        this.btn_turbo.addTouchEventListener(this.onTurboPress.bind(this));

        this.btn_menu = this.panel_group_btn_1.getChildByName("btn_menu");
        this.btn_menu.addTouchEventListener(this.onMenuPress.bind(this));


        this.panel_group_btn_2 = this.bg_reel.getChildByName("panel_group_btn_2");
        this.panel_group_btn_2.setLocalZOrder(1000);
        this.panel_group_btn_2.setVisible(false);

        this.btn_history = this.panel_group_btn_2.getChildByName("btn_history");
        // this.btn_spin.addTouchEventListener(this.onSpinSelect.bind(this));

        this.btn_close = this.panel_group_btn_2.getChildByName("btn_close");
        this.btn_close.addTouchEventListener(this.onMenuPress.bind(this));

        this.btn_help = this.panel_group_btn_2.getChildByName("btn_help");
        // btn_reduce.addTouchEventListener(this.onSubPress.bind(this));

        this.btn_sound = this.panel_group_btn_2.getChildByName("btn_sound");
        


        var credit_bg = bot_layer.getChildByName("credit_bg");
        credit_bg.setLocalZOrder(905);
        this.txt_left = credit_bg.getChildByName("txt_left");
        this.txt_mid = credit_bg.getChildByName("txt_mid");
        this.txt_right = credit_bg.getChildByName("txt_right");


        this.columns = [];
        for(var i = 0;i<this.config.col;i++){
            var config = {};
            config.num_row = this.config.row;
            config.distance = distance ;
            config.wait_time = 0.2*i;
            var x = a_step_x * i + b_step_x;
            var y = this.bg_reel.height * percent_height;
            config.x = x;
            config.y = y;
            config.node = this;
            var col = new Column(config);
            this.columns.push(col);
        }
        
        this.setLabelBetScore(BET_VALUES[this.current_bet_index])
        this.setLabelWinScore(0.00)

        this.loadAnimThanTai();

        return true;
    },
    loadAnimThanTai: function(){
        var delayTime = 0.15;
        var anim = new cc.Animation();
        for(var i = 1; i<=17; ++i){
            var frameName = "than_tai_" + i +".png";
            anim.addSpriteFrame(ResourceManager.getSpriteFrame(frameName));
        }
        anim.setDelayPerUnit(delayTime);
        anim.setRestoreOriginalFrame(true);
        // anim.retain(); 
        var action_anim = new cc.RepeatForever(cc.animate(anim));
        
        this.than_tai.runAction(action_anim)

    },
    getResultRender: function(){
        var flag = true;
        for(var i = 0;i<this.config.col;i++){
            flag = flag && !this.columns[i].getAction();
        }
        if(flag){
            var size = Object.keys(this.getResultRender.line_win).length;
            if (size>0){
                for(var i = 0;i<this.config.col;i++){
                    this.columns[i].changeItemColor(true);
                }
            }
            var delay = 0.8;
            for(var k in this.getResultRender.line_win){
                var count = 0
                for(var i = 0;i<this.config.col;i++){
                    this.columns[i].renderResult(k,delay);
                    count += 1;
                    if (count > this.getResultRender.line_win[k].consecutive){
                        break;
                    }
                }
                delay += 0.8;
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
    onMenuPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                    this.panel_group_btn_1.setVisible(!this.panel_group_btn_1.visible);
                    this.panel_group_btn_2.setVisible(!this.panel_group_btn_2.visible);
                break;
            default:
                break;
        }
    },
    onTurboPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                this.time_scale_index += 1;
                if (this.time_scale_index >= TIME_SCALE.length){
                    this.time_scale_index = 0;
                }
                cc.director.getScheduler().setTimeScale(TIME_SCALE[this.time_scale_index])
                break;
            default:
                break;
        }
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