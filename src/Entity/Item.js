
const ACTIONS = {
    RUN: 1,
    STOP:0
}
const MOVE_SPEED = 3200;

const ITEM_IMAGE_SCALE_MOBILE = 0.6;
const ITEM_IMAGE_SCALE_PC = 0.24;
const WILD_SCALE_PC = 0.08;
const WILD_SCALE_MOBILE = 0.16;
const BORDER_SCALE_PC = 0.065;
const BORDER_SCALE_MOBILE = 0.13;

const ITEM_IDLE_SCALE = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "wild": 0,
    "scatter": 0
}

const ITEM_IDLE_ZORDER = {
    "0": 100,
    "1": 100,
    "2": 100,
    "3": 100,
    "4": 100,
    "5": 100,
    "wild": 200,
    "scatter":400
}

var Item = cc.Sprite.extend({
    ctor: function(item_code){
        this._super();
        this.node;
        this.item_idle;
        this.item_code = item_code;
        this.wait_time = 0;
        this.action = ACTIONS.STOP;
        this.scaleItemFrame = ITEM_IMAGE_SCALE_PC;
        this.scaleWild = WILD_SCALE_PC;
        this.scaleBorder = BORDER_SCALE_PC;
        this.anims = {};
        this.init();

    },
    init : function () {
        
        ResourceManager.addSpriteFramesResource("item");
        this.node = ccs.load(res.Item_json).node;
        this.item_idle = this.node.getChildByName("bg_item");
        if (cc.sys.isMobile){
            this.scaleItemFrame = ITEM_IMAGE_SCALE_MOBILE;
            this.scaleWild = WILD_SCALE_MOBILE;
            this.scaleBorder = BORDER_SCALE_MOBILE;
        }
        //load anim wild
        // this.initAnims();
        
        //load border
        // this.loadBorder();
        
        this.loadItemIdle();
        this.addChild(this.node);
    },
    initAnims : function() {
        //wild
        // var delayTime = 0.04;
        // var anim = new cc.Animation();
        // for(var i = 1; i<=21; ++i){
        //     var frameName = "cf_" + i +".png";
        //     anim.addSpriteFrame(ResourceManager.getSpriteFrame(frameName));
        // }
        // this.anims['wild'] = anim;
        // anim.setDelayPerUnit(delayTime * 2);
        // anim.setRestoreOriginalFrame(true);
        // anim.retain();
        // //sakura leave
        // anim = new cc.Animation();
        // for(var i = 0; i<=19; ++i){
        //     var frameName = "sakura-leaves-" + i +".png";
        //     anim.addSpriteFrame(ResourceManager.getSpriteFrame(frameName));
        // }
        // this.anims['sakura'] = anim;
        // anim.setDelayPerUnit(delayTime * 2);
        // anim.setRestoreOriginalFrame(true);
        // anim.retain();

    },
    loadBorder : function () {
        // var frame = ResourceManager.getSpriteFrame("border.png");
        // var border = new cc.Sprite(frame);
        // this.node.addChild(border);
        // border.scale = this.scaleBorder;
    },
    setWaitTime : function(wait_time) {
        this.wait_time = wait_time;
    },
    setItemCode : function(item_code) {
        this.item_code = item_code;
        this.loadItemIdle();
    },
    getItemCode : function() {
        return this.item_code;
    },
    getAction : function() {
        return this.action;
    },
    loadItemIdle: function(){
        
        this.setVisible(true);
        this.item_idle.removeAllChildren();
        this.item_idle.stopAllActions();
        switch (this.item_code) {
            // case "wild":
            //     this.loadItemWild();
            //     break;
            // case "scatter":
            //     this.loadItemScatter();
            //     break
            default:
                
                this.item_idle.scale = this.scaleItemFrame ;
                var frame = ResourceManager.getSpriteFrame("symbol_" + this.item_code + ".png");
                this.item_idle.setSpriteFrame(frame);
                this.setLocalZOrder(ITEM_IDLE_ZORDER[this.item_code]);
                break;
        }
        this.item_idle.scale = this.item_idle.scale + ITEM_IDLE_SCALE[this.item_code];
        
    },
    loadItemWild: function(){
        this.item_idle.scale = this.scaleWild;
        var action_anim = new cc.RepeatForever(cc.animate(this.anims['wild']));
        this.item_idle.runAction(action_anim);
        var txt_sprite = new cc.Sprite(ResourceManager.getSpriteFrame("wild_text.png"))
        txt_sprite.scale = 0.5;
        this.item_idle.addChild(txt_sprite);
        txt_sprite.anchorX = 0;
        txt_sprite.anchorY = 0.2;
        txt_sprite.x = 30;
    },
    loadItemScatter: function(){
        var frame = ResourceManager.getSpriteFrame("symbol_" + this.item_code + ".png");
        this.item_idle.setSpriteFrame(frame);
        this.item_idle.scale = this.scaleItemFrame;

        // this.item_idle.setScale(this.scaleWild);
        var action_anim = new cc.RepeatForever(cc.animate(this.anims['sakura']));
        var anim_sprite = new cc.Sprite();
        anim_sprite.runAction(action_anim);
        this.item_idle.addChild(anim_sprite);
        anim_sprite.scale = 2.5;
        anim_sprite.anchorX = 0.1;
        anim_sprite.anchorY =  0.1;
        var txt_sprite = new cc.Sprite(ResourceManager.getSpriteFrame("scatter_text.png"))
        // txt_sprite.setScale(0.8);
        this.item_idle.addChild(txt_sprite);
        txt_sprite.anchorX = 0;
        txt_sprite.anchorY = 0.3;
        // txt_sprite.x = this.item_idle.width/2 + 10;
    },
    setPosition: function (position){
        this.setVisible(false);
        this.node.position = position;
        this.node.x = position.x;
        this.node.y = position.y;
        this.setVisible(true);
    },
    spin: function(position){
        this.action = ACTIONS.RUN;
        var distance = Math.sqrt((position.x - this.node.x) *(position.x - this.node.x) + (position.y - this.node.y)*(position.y - this.node.y))
        var speed = MOVE_SPEED;
        
        var time = distance / speed;
        var action = cc.moveTo(time,position).easing(cc.easeIn(0.6));
        this.node.runAction(cc.sequence(cc.delayTime(this.wait_time),action,cc.callFunc(function () {
            this.stop(position);
        }.bind(this))))
    },
    stop: function (position) {
        this.setPosition(position);
        var action = cc.jumpTo(0.5,cc.p(this.node.x,this.node.y+5),5,2)
        this.node.runAction(action);
        this.action = ACTIONS.STOP;
    },
    // animResult: function(delay) {
    //     var color = this.color;
    //     var action = cc.sequence(
    //         cc.tintTo(0.01, 254, 247, 24),
    //         cc.blink(0.4, 3),
    //         cc.tintTo(0.01, color.r, color.g, color.b)

    //     );
    //     this.node.runAction(cc.sequence(cc.delayTime(delay), action));
    // }
    animResult: function(delay) {
        // this.changeColor(true);
        // var action = cc.sequence(
        //     cc.blink(0.5, 3)

        // );
        // this.node.runAction(cc.sequence(cc.delayTime(delay), action));
        var action = cc.sequence(
            cc.tintTo(0.01, 255, 255, 255),
            cc.blink(0.48, 2),
            cc.tintTo(0.01, 127, 127, 127)

        );
        this.node.runAction(cc.sequence(cc.delayTime(delay), action));
        // this.changeColor(false);
    },
    changeColor: function(change = false) {
        if (!change){
            // this.node.color = new cc.hexToColor('#ffffff');
            this.node.runAction(new cc.tintTo(0, 255, 255, 255));
        }else{
            this.node.runAction(new cc.tintTo(0, 127, 127, 127));
        }
    }


});