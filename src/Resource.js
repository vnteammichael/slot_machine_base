var res = {
    HelloWorld_png : "res/background.jpg",
    MainScene_json : "res/MainScene.json",
    Item_json : "res/Item.json",
    layer_pc_json : "res/layer_pc.json",
    layer_mobile_json : "res/layer_mobile.json",
    item_plist:"res/item.plist",
    item_png:"res/item.png",
    wild_symbol_plist:"res/wild_symbol.plist",
    wild_symbol_png:"res/wild_symbol.png",
    sakura_leave_plist:"res/sakura_leave.plist",
    sakura_leave_png:"res/sakura_leave.png"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
