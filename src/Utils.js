var getScaleToFitImageToWinSize = function (originalImageSize) {
    var winSize = cc.director.getWinSize();

    var widthScale = winSize.width / originalImageSize.width;
    var heightScale = winSize.height / originalImageSize.height;
    return Math.max(widthScale, heightScale);
}

var convertNumberToString = function (value) {
    var arr1 = value.toString().split(".");
    var arr2 = arr1[0].toString().split("");
    var string = arr1[1]?arr1[1]:"00";
    string = string.length<2?string+"0":string
    string = "." + string;
    var temp = 1;
    for (var i = arr2.length - 1; i >= 0; i--) {
        string = arr2[i] + string;
        if (temp % 3 === 0 && temp != arr2.length) {
            string = "," + string;
        }
        temp++;
    }
    return string;
}
var sleep = function (delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

var BET_VALUES = [0.3,0.6,1.2,30,120,500];


var NumberAnimationAction = cc.ActionInterval.extend({
    _startNumber: 0,
    _endNumber: 100,
    _currentNumber: 0,

    ctor: function (duration, startNumber, endNumber) {
        this._super(duration);
        this._startNumber = startNumber;
        this._endNumber = endNumber;
        this._currentNumber = startNumber;
    },

    update: function (dt) {  // dt ranges from 0 to 1
        this._currentNumber = this._startNumber + (this._endNumber - this._startNumber) * dt;
        if (this.target) {
            this.target.setString(convertNumberToString(Math.round(this._currentNumber*100)/100));
        }
    }
});

// Helper function to easily create the animation action
cc.NumberAnimationAction = function (duration, startNumber, endNumber) {
    return new NumberAnimationAction(duration, startNumber, endNumber);
};