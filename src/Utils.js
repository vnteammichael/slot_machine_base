var getScaleToFitImageToWinSize = function (originalImageSize) {
    var winSize = cc.director.getWinSize();

    var widthScale = winSize.width / originalImageSize.width;
    var heightScale = winSize.height / originalImageSize.height;
    return Math.max(widthScale, heightScale);
}