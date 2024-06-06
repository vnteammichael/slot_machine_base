function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

var MainScene = cc.Scene.extend({
    ctor:function () {
        this._super();
        
        this.layer = new PlayScreen();
        // if (cc.sys.isMobile){
        //     this.layer = new MobileScreen();
        // }
        this.layer.setName("layer");
        this.addChild(this.layer);
    },
    getMainLayer: function () {
        return this.layer;
    }
});

