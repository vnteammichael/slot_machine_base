

var Column = cc.Class.extend({
    ctor: function(config){
        // this.super();

        this.callbacks = new Map();
        this.item_list = [];
        this.x = config.x;
        this.y = config.y;
        this.node = config.node;
        this.num_row = config.num_row;
        this.distance = config.distance;
        this.num_items = config.num_item || 15;
        this.wait_time = config.wait_time;
        this.start_step = 0 - Math.ceil(this.num_row/2);
        this.action = ACTIONS.STOP;
        
        this.init();

    },
    init : function () {
        // Create 15 item with random code
        for ( var i = 0;i<this.num_items; i++){
            var code = Math.floor(Math.random() * 8);// rand from 0 -> 9
            if (code == 6){
                code = "wild";
            }
            if (code == 7){
                code = "scatter";
            }
            var item = new Item(code);
            var pos = cc.p(this.x,this.y + (this.start_step + i) * this.distance)
            item.anchorX = 0.5;
            item.anchorY = 0.5;
            item.setPosition(pos);
            item.setWaitTime(this.wait_time);
            this.node.bg_reel.addChild(item);
            this.item_list.push(item);

        }
    },
    loadResult : function(result_codes){
        for(var i=0; i<result_codes.length;i++){
            this.item_list[this.num_items - this.num_row - 1 + i].setItemCode(result_codes[i]);

        }
    },
    getAction : function() {
        return this.action;
    },
    spinReel: function(){
        for(var i = 0;i<this.num_items;i++){
            var point = this.num_items - this.num_row - 2;
            var pos = cc.p(this.x,this.y + (this.start_step + i - point) * this.distance);
            this.item_list[i].spin(pos);
        }
        this.action = ACTIONS.RUN;
        this.schedule(this.resetReel,this, 1);
    },
    changeItemColor: function(change = false){
        for(var i=1;i<this.num_row+1;i++){
            this.item_list[i].changeColor(change);
        }
    },
    renderResult: function(item_code,delay){
        //check if get in lines win, call a anim
        for(var i=1;i<this.num_row+1;i++){
            if(this.item_list[i].getAction() == ACTIONS.STOP &&( this.item_list[i].getItemCode() == item_code || this.item_list[i].getItemCode() == "wild")){
                this.item_list[i].animResult(delay);
            }
        }

    },
    resetReel: function(){
        var point = this.num_items - this.num_row - 2;
        var count = 0;
        for(var i=0;i<point;i++){
            if(this.item_list[i].getAction() == ACTIONS.STOP){
                count+=1;
            }
        }
        
        if (count>=point){
            var temp_list = this.item_list.slice(0,point); 
            this.item_list = this.item_list.slice(point).concat(temp_list);
            for(var i=this.num_items - point;i<this.num_items;i++){
                if(this.item_list[i].getAction() == ACTIONS.STOP){

                    var pos = cc.p(this.x,this.y + (this.start_step + i) * this.distance);
                    this.item_list[i].setPosition(pos);
                    var code = Math.floor(Math.random() * 8);// rand from 0 -> 9
                    if (code==6){
                        code = "wild";
                    }
                    if (code == 7){
                        code = "scatter";
                    }
                    this.item_list[i].setItemCode(code);
                }
            }
            
            this.action = ACTIONS.STOP;
            this.unschedule(this.resetReel,this);
        }
    },
    schedule: function(callback, target, interval, repeat, delay) {
        const scheduler = cc.director.getScheduler();
        const wrappedCallback = callback.bind(target);

        this.callbacks.set(callback, wrappedCallback);

        scheduler.schedule(wrappedCallback, target, interval, repeat, delay, false);
    },
    unschedule: function(callback, target) {
        const scheduler = cc.director.getScheduler();
        const wrappedCallback = this.callbacks.get(callback);

        if (wrappedCallback) {
            scheduler.unschedule(wrappedCallback, target);
            this.callbacks.delete(callback);
        }
    }
});