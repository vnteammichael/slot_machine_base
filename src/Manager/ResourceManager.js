var ResourceManager = ResourceManager || {}

ResourceManager.addSpriteFramesResource = function (source) {
    switch (source) {
        case "item":
            if (ResourceManager.idleItem === undefined){
                cc.spriteFrameCache.addSpriteFrames(res.item_plist,res.item_png);
                    ResourceManager.idleItem = true;
            }
            break;
        case "than_tai":
            if (ResourceManager.thanTai === undefined){
                cc.spriteFrameCache.addSpriteFrames(res.than_tai_plist,res.than_tai_png);
                    ResourceManager.thanTai = true;
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

