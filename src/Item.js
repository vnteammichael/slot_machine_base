
const ACTIONS = {
    RUN: 1,
    STOP:0
}
const MOVE_SPEED = 1200;

var Item = cc.Sprite.extend({
    ctor: function(item_code){
        this._super();
        this.node;
        this.item_idle;
        this.item_code = item_code;
        this.wait_time = 0;
        this.action = ACTIONS.STOP;
        this.init();

    },
    init : function () {
        this.node = ccs.load(res.Item_json).node;
        this.node.scale = 0.47;
        this.item_idle = this.node.getChildByName("bg_item").getChildByName("item_img");
        this.loadItemIdle();
        // this.node.x = 50;
        // this.node.y = 230;
        // this.setPosition(cc.p(this.x,this.y))
        this.addChild(this.node);
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
        var frame = ResourceManager.getSpriteFrame("goods_" + this.item_code + ".png");
        this.item_idle.setSpriteFrame(frame);
        this.item_idle.scale = 4;
    },
    setPosition: function (position){
        this.node.position = position;
        this.node.x = position.x;
        this.node.y = position.y;
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
    // move: function(lastPos,nextPos,targetPos){
    //     this.setPosition(lastPos);
    //     var distance = Math.sqrt((nextPos.x - this.node.x) *(nextPos.x - this.node.x) + (nextPos.y - this.node.y)*(nextPos.y - this.node.y))
    //     var speed = MOVE_SPEED.PHASE_1;
    //     if (Math.abs(this.node.y - targetPos.y)<DISTANCE_PHASE_1){
    //         speed = Math.abs(this.node.y - targetPos.y)*4
    //     }
    //     var time = distance / speed;
    //     // console.log(Math.abs(this.node.y - targetPos.y));
    //     var moveTo = cc.moveTo(time,nextPos);
    //     if (this.node.y - targetPos.y>0){
    //     // if (distance!==0){
    //         this.node.runAction(cc.sequence(moveTo, cc.callFunc(function () {
    //         this.move(this.node.position,cc.p(this.node.x,this.node.y-50), targetPos);
    //         }.bind(this))));
    //     }else{
    //         this.node.y = 400;
    //     }
        
    //     // this.node.runAction(cc.sequence(moveTo));
    // }, 
    stop: function (position) {
        this.setPosition(position);
        var action = cc.jumpTo(0.5,cc.p(0,this.node.y+5),5,2)
        this.node.runAction(action);
        this.action = ACTIONS.STOP;
    },
    animResult: function() {
        var color = this.color;
        var action = cc.sequence(
            cc.tintTo(0.1, 254, 247, 24),
            cc.blink(1, 4),
            cc.tintTo(0.1, color.r, color.g, color.b)

        );
        this.node.runAction(action);
    }


});