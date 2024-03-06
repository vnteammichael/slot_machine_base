

var Column = cc.Node.extend({
    ctor: function(config){
        this._super();
        this.item_list = [];
        this.num_row = config.num_row;
        this.distance = config.distance;
        this.num_items = config.num_item || 7;
        this.wait_time = config.wait_time;
        this.start_step = 0 - Math.ceil(this.num_row/2);
        this.action = ACTIONS.STOP;
        
        this.init();

    },
    init : function () {
        // Create 15 item with random code
        for ( var i = 0;i<this.num_items; i++){
            var code = Math.floor(Math.random() * 10);// rand from 0 -> 9
            if (code==8){
                code = "wild";
            }
            if (code == 9){
                code = "scatter";
            }
            var item = new Item(code);
            var pos = cc.p(0,(this.start_step + i) * this.distance)
            item.anchorX = 0.5;
            item.anchorY = 0.5;
            item.setPosition(pos);
            item.setWaitTime(this.wait_time);
            this.addChild(item);
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
            var pos = cc.p(0,(this.start_step + i - point) * this.distance);
            this.item_list[i].spin(pos);
        }
        this.action = ACTIONS.RUN;
        this.schedule(this.resetReel, 1);
    },
    renderResult: function(){
        //check if get in lines win, call a anim
        for(var i=1;i<this.num_row+1;i++){
            if(this.item_list[i].getAction() == ACTIONS.STOP){
                this.item_list[i].animResult();
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

                    var pos = cc.p(0,(this.start_step + i) * this.distance);
                    this.item_list[i].setPosition(pos);
                    // var code = Math.floor(Math.random() * 10);// rand from 0 -> 9
                    // if (code==8){
                    //     code = "wild";
                    // }
                    // if (code == 9){
                    //     code = "scatter";
                    // }
                    // this.item_list[i].setItemCode(code);
                }
            }
            
            this.action = ACTIONS.STOP;
            this.unschedule(this.resetReel);
        }
    }
});