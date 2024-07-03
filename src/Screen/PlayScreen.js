
var DISTANCE = {
    "pc": 45,
    "mobile": 109
}
var A_STEP_X = {
    "pc": 34.6,
    "mobile": 82.8
}
var B_STEP_X = {
    "pc": 171,
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
        this.txt_noti = ccui.helper.seekWidgetByName(bot_layer,"txt_noti");
        this.txt_noti.setVisible(false);
        this.txt_noti.setString("");

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
        this.txt_auto_spin = this.btn_spin.getChildByName("txt_auto_spin");
        this.txt_auto_spin.setVisible(false);



        this.btn_add = this.panel_group_btn_1.getChildByName("btn_add");
        this.btn_add.addTouchEventListener(this.onAddPress.bind(this));

        this.btn_reduce = this.panel_group_btn_1.getChildByName("btn_reduce");
        this.btn_reduce.addTouchEventListener(this.onSubPress.bind(this));

        this.btn_auto = this.panel_group_btn_1.getChildByName("btn_auto");
        this.btn_auto.addTouchEventListener(this.onAutoPress.bind(this));
        
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

        this.bg_popup = this.bg_reel.getChildByName("bg_popup");
        this.bg_popup.setLocalZOrder(2000);
        this.bg_popup.setVisible(false);

        this.popup1 = this.bg_reel.getChildByName("popup1");
        this.popup1.setLocalZOrder(2000);
        this.popup1.setVisible(false);
        var btn_reconnect = this.popup1.getChildByName("btn_popup");
        btn_reconnect.addTouchEventListener(this.onReconnectPress.bind(this));
        
        this.popup2 = this.bg_reel.getChildByName("popup2");
        this.popup2.setLocalZOrder(2000);
        this.popup2.setVisible(false);
        var btn_close = this.popup2.getChildByName("btn_popup");
        btn_close.addTouchEventListener(this.onClosePopupPress.bind(this));
        
        this.popup3 = this.bg_reel.getChildByName("popup3");
        this.popup3.setLocalZOrder(2000);
        this.popup3.setVisible(false);
        var btn_close_auto_popup = this.popup3.getChildByName("btn_close_auto_popup");
        btn_close_auto_popup.addTouchEventListener(this.onClosePopupPress.bind(this));
        var btn_50 = this.popup3.getChildByName("btn_50");
        btn_50.addTouchEventListener(this.onAutoSelectPress.bind(this));
        var btn_100 = this.popup3.getChildByName("btn_100");
        btn_100.addTouchEventListener(this.onAutoSelectPress.bind(this));
        var btn_200 = this.popup3.getChildByName("btn_200");
        btn_200.addTouchEventListener(this.onAutoSelectPress.bind(this));
        var btn_999 = this.popup3.getChildByName("btn_999");
        btn_999.addTouchEventListener(this.onAutoSelectPress.bind(this));

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

        this.is_auto = false;
        this.num_auto_selected = 0;

        this.is_stop = true;
        this.is_free_game = false;

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
            this.setLabelNotiAnim(this.getResultRender.line_win);
            var delay = 0.2;
            for(var k in this.getResultRender.line_win){
                var count = 0;
                for(var i = 0;i<this.config.col;i++){
                    this.columns[i].renderResult(k,delay,size);
                    count += 1;
                    if (count > this.getResultRender.line_win[k].consecutive){
                        break;
                    }
                }
                // var new_string = convertNumberToString(this.getResultRender.line_win[k]['reward']);
                // this.setLabelNoti(new_string=new_string,duration=delay,delay = size * 2);
                delay += 2;
            }
            this.unschedule(this.getResultRender);
        }
    },
    onSpinSelect: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:

                var flag = true;
                for(var i = 0;i<this.config.col;i++){
                    flag = flag && !this.columns[i].getAction();
                }

                if (sender.data_bonus && sender.data_bonus.length>0 && this.is_free_game && flag){
                    this.setLabelNoti();
                    var str = sender.data_bonus.length + " free games";
                    this.setLabelNoti(str);
                    var data = sender.data_bonus.pop();
                    data['valid_amount'] = sender.valid_amount + data['reward']
                    sender.valid_amount += data['reward']
                    this.loadAnimSpinFree(data);
                    this.enableButtonChangeBet(false);

                }else if (sender.data_bonus ){
                    if (sender.data_bonus.length == 0){
                        this.is_free_game = false;
                        this.enableButtonChangeBet(true);
                    }
                }
                if (!this.is_auto && !this.is_free_game && flag){
                    this.setLabelNoti();
                    ActionMapping.dispatch(SpinAction,{"token":gv.token,"bet":BET_VALUES[this.current_bet_index],"game_code":"SL001"});
                }
    

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
            if (this.is_auto){
                this.is_stop = false;
                
                this.start_time = (new Date()).getTime();
                this.end_time = (Object.keys(this.getResultRender.line_win).length * 2 + 0.2) * 1000;
            }

            if (data.is_free_game){
                this.is_free_game = true;
                this.btn_spin.data_bonus = data.bonus;
                this.btn_spin.valid_amount = data.valid_amount;
            }else{
                this.is_free_game = false;
                this.btn_spin.data_bonus = null;
            }
            
        }
        //set win number
        if (data.total_reward >0){
            var duration = 2 * Object.keys(data.line_win).length
            
            this.setLabelWinScore(data.total_reward,duration, delay = 0.5);
        }else{
            
            this.setLabelWinScore(data.total_reward);
        }
        this.setLabelUserScore(Math.floor(data.valid_amount * 100)/100);
    },
    loadAnimSpinFree: function(data){
        
        var result = data['result'];
        for (var i = 0;i<this.columns.length;i++){
            this.columns[i].loadResult(result[i].reverse())
        }
        var flag = true;
        for(var i = 0;i<this.config.col;i++){
            flag = flag && !this.columns[i].getAction();
        }
        if(flag){
            for(var i = 0;i<this.config.col;i++){
                this.columns[i].spinReel();
            }
            this.getResultRender.line_win = data['line_win']
            this.schedule(this.getResultRender, 1);
            if (this.is_auto){
                this.is_stop = false;
                
                this.start_time = (new Date()).getTime();
                this.end_time = (Object.keys(this.getResultRender.line_win).length * 2 + 0.2) * 1000;
            }
            
        }
        //set win number
        if (data['reward'] >0){
            var duration = 2 * Object.keys(data['line_win']).length
            
            this.setLabelWinScore(data['reward'],duration, delay = 0.5);
        }else{
            
            this.setLabelWinScore(data['reward']);
        }
        this.setLabelUserScore(Math.floor(data['valid_amount'] * 100)/100);
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
    onAutoPress: function(sender,type){

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (!this.is_auto){
                    this.bg_popup.setVisible(true);
                    this.popup3.setVisible(true);
                }else{
                    this.unschedule(this.getNextSpin);
                    this.is_auto = false;
                    this.num_auto_selected = 0;
                    this.spin_icon.setVisible(true);
                    this.txt_auto_spin.setVisible(false);
                    this.btn_add.setEnabled(true);
                    this.btn_reduce.setEnabled(true);
                }
                break;
            default:
                break;
        }
    },
    setLabelBetScore: function(bet) 
    {
        this.txt_right.setString(convertNumberToString(bet))

    },
    setLabelNoti: function(new_string = "") 
    {

        if (new_string==""){
            this.txt_noti.stopAllActions();
            this.txt_noti.setString("");
            this.txt_noti.setVisible(false);
        }else if (new_string != this.txt_mid.string){
            this.txt_noti.setVisible(true);
            this.txt_noti.setString(new_string);
            cc.log(new_string)

        }

    },
    setLabelNotiAnim: function(data) 
    {
        var size = Object.keys(data).length;
        if (size > 0){
            var list_action = [];
            this.txt_noti.setVisible(true);
            var duration = 2;
            for(var k in data){
                // list_action.push(cc.delayTime(0.2));
                // var new_string = convertNumberToString(data[k]['reward']);
                var new_string = "";
                if (k == "scatter"){
                    new_string = data[k]['reward'] + " free games";
                }else{
                    new_string = convertNumberToString(Math.round(data[k]['reward'] * 100) / 100);
                }
                var labelAnimation = new ChangeLabelStringAction(duration,new_string);
                // var action = cc.sequence( labelAnimation,cc.delayTime(size * 2 - duration + 0.2));
                list_action.push(labelAnimation);
            }
            // var spawnActions = cc.spawn.apply(null, list_action);
            var sequence = cc.sequence(list_action);
            var repeat = cc.repeatForever(sequence);
    
            // Chạy hành động spawn trên label
            this.txt_noti.runAction(repeat);
        }

    },
    setLabelWinScore: function(win, duration = 0, delay = 0) 
    {
        var numAnimation = new NumberAnimationAction(duration, 0, win); 
        this.txt_mid.runAction(cc.sequence(cc.delayTime(delay), numAnimation));
        // this.txt_mid.setString(convertNumberToString(win))

    },
    setLabelUserScore: function(score) 
    {
        this.txt_left.setString(convertNumberToString(score))

    },
    popup: function(type_popup)
    {
        //type 1: disconnected
        //type 2: not enough money
        //3 popup auto spin
        switch (type_popup) {
            case 1:
                this.bg_popup.setVisible(true);
                this.popup1.setVisible(true);
                break;
            case 2:
                this.bg_popup.setVisible(true);
                this.popup2.setVisible(true);
                break;
            case 3:
                this.bg_popup.setVisible(true);
                this.popup3.setVisible(true);
                break;
            default:
                break;

        }

    },
    onClosePopupPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                this.bg_popup.setVisible(false);
                this.popup2.setVisible(false);
                this.popup3.setVisible(false);
                break;
            default:
                break;
        }
    },
    onReconnectPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                this.bg_popup.setVisible(false);
                this.popup1.setVisible(false);
                
                GameGUIManager.view(LoaderScene);
                break;
            default:
                break;
        }
    },
    onAutoSelectPress: function(sender,type){
        
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                this.bg_popup.setVisible(false);
                this.popup3.setVisible(false);
                this.is_auto = true;
                this.num_auto_selected = parseInt(sender.titleText);
                this.spin_icon.setVisible(false);
                this.txt_auto_spin.setVisible(true);
                this.txt_auto_spin.setString(this.num_auto_selected);
                // this.btn_add.setEnabled(false);
                // this.btn_reduce.setEnabled(false);
                this.enableButtonChangeBet(false);
                this.schedule(this.getNextSpin,1);
                break;
            default:
                break;
        }
    },
    getNextSpin: function(){
        if (this.is_auto && this.is_stop && !this.is_free_game){
            this.setLabelNoti();
            ActionMapping.dispatch(SpinAction,{"token":gv.token,"bet":BET_VALUES[this.current_bet_index],"game_code":"SL001"})
            this.num_auto_selected -= 1;
            this.txt_auto_spin.setString(this.num_auto_selected);
        }else if(this.is_auto && this.is_stop &&this.btn_spin.data_bonus && this.btn_spin.data_bonus.length>0 && this.is_free_game){
            this.setLabelNoti();
            var str = this.btn_spin.data_bonus.length + " free games";
            this.setLabelNoti(str);
            var data = this.btn_spin.data_bonus.pop();
            data['valid_amount'] = this.btn_spin.valid_amount + data['reward']
            this.btn_spin.valid_amount += data['reward']
            this.num_auto_selected -= 1;
            this.txt_auto_spin.setString(this.num_auto_selected);
            this.loadAnimSpinFree(data);
            this.enableButtonChangeBet(false);
            if (this.btn_spin.data_bonus.length == 0){
                this.is_free_game = false;
                this.enableButtonChangeBet(true);
            }
        }
        else if (this.is_auto && ((new Date()).getTime() - this.start_time >= this.end_time * (1/TIME_SCALE[this.time_scale_index]))){
            this.is_stop = true;
        }

        if (this.num_auto_selected <= 0){
            this.unschedule(this.getNextSpin);
            this.is_auto = false;
            this.num_auto_selected = 0;
            this.spin_icon.setVisible(true);
            this.txt_auto_spin.setVisible(false);
            // this.btn_add.setEnabled(true);
            // this.btn_reduce.setEnabled(true);
            this.enableButtonChangeBet(true);
        }
    },
    enableButtonChangeBet: function(enable){
        this.btn_add.setEnabled(enable);
        this.btn_reduce.setEnabled(enable);
    }
});