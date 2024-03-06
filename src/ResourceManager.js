var ResourceManager = ResourceManager || {}

ResourceManager.addSpriteFramesResource = function (source) {
    switch (source) {
        case "item":
            if (ResourceManager.idleItem === undefined){
                cc.spriteFrameCache.addSpriteFrames(res.item_plist,res.item_png);
                cc.spriteFrameCache.addSpriteFrames(res.wild_symbol_plist,res.wild_symbol_png);
                cc.spriteFrameCache.addSpriteFrames(res.sakura_leave_plist,res.sakura_leave_png);
                    ResourceManager.idleItem = true;
            }
            break;
    
        default:
            break;
    }
}

ResourceManager.getSpriteFrame = function (source) {
    var spriteframe = cc.spriteFrameCache.getSpriteFrame(source);
    if (!spriteframe)
        cc.log("Get source error:", source);
    return spriteframe;
};

