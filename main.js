const pcWidth = 480;
const pcHeight = 360;

const mobileHeight = 932;
const mobileWidth = 430;

const pcRatio = pcWidth/pcHeight;
var gv = gv || {};


cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    cc.view.adjustViewPort(true);

    if (cc.sys.os === cc.sys.OS_X || cc.sys.os === cc.sys.OS_WINDOWS){
        var currentBrowserRatio = window.innerWidth/window.innerHeight;
        if (currentBrowserRatio >= pcRatio){
            cc.view._adjustSizeToBrowser(); 
            cc.view.setDesignResolutionSize(pcWidth, pcHeight, cc.ResolutionPolicy.SHOW_ALL);
        }else{
            cc.view._adjustSizeToBrowser(); 
            cc.view.setDesignResolutionSize(pcWidth, pcHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        }
        
        
    }else{
        cc.view.enableAutoFullScreen(false);
        cc.view.setDesignResolutionSize(mobileWidth, mobileHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        
    }
    cc.view.resizeWithBrowserSize(true);
    var urlParams = new URLSearchParams(window.location.search);
    gv.TOKEN = urlParams.get("q");
    gv.USER_ID = "token";
    gv.gameclient  = new GameClient();
    // GameGUIManager.getSceneOrCreate(MainScene);
    gv.gameclient.connect("ws://192.168.120.30:8080");
    


    var loaderScene = new LoaderScene(g_resources);
    cc.director.runScene(loaderScene);
   
};

let debounceTimer;
window.addEventListener('resize', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(adjustCanvas, 100); // Đợi 100ms sau sự kiện resize cuối cùng để thực hiện
    // adjustCanvas()
});

function adjustCanvas() {
    if (cc.sys.os === cc.sys.OS_X || cc.sys.os === cc.sys.OS_WINDOWS){
        var currentBrowserRatio = window.innerWidth/window.innerHeight;
        if (currentBrowserRatio >= pcRatio){
            cc.view.setDesignResolutionSize(pcWidth, pcHeight, cc.ResolutionPolicy.SHOW_ALL);
            // cc.view.resizeWithBrowserSize(true);
        }else{
            cc.view.setDesignResolutionSize(pcWidth, pcHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        }
        var canvasSize = cc.director.getWinSize(); // Lấy kích thước mới của canvas
        var scene = cc.director.getRunningScene();
        
        // Tính toán vị trí mới để đặt scene ở giữa canvas mới
        var newX = canvasSize.width / 2;
        var newY = canvasSize.height / 2;

        // Giả sử scene của bạn hỗ trợ phương thức setPosition
        if(scene && scene.setPosition) {
            scene.anchorX = 0.5;
            scene.anchorY = 0.5;
            scene.setPosition(newX - scene.width / 2, newY - scene.height / 2);
        }
        cc.view.resizeWithBrowserSize(true);
        
    }
};
cc.game.run();