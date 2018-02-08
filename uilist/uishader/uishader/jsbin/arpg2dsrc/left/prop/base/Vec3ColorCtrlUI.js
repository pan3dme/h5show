var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var Vec3ColorCtrlUI = (function (_super) {
        __extends(Vec3ColorCtrlUI, _super);
        function Vec3ColorCtrlUI() {
            _super.apply(this, arguments);
        }
        Vec3ColorCtrlUI.prototype.initView = function () {
            this.textLabelUI = new prop.TextLabelUI();
            this.textX = new prop.TextLabelUI();
            this.textY = new prop.TextLabelUI();
            this.textZ = new prop.TextLabelUI();
            this.textX.label = "X:";
            this.textY.label = "Y:";
            this.textZ.label = "Z:";
            this.inputTextUiX = new prop.InputTextUi();
            this.inputTextUiX.text = "255";
            this.inputTextUiY = new prop.InputTextUi();
            this.inputTextUiY.text = "0";
            this.inputTextUiZ = new prop.InputTextUi();
            this.inputTextUiZ.text = "255";
            this.colorPickUI = new prop.ColorPickUI();
            this.inputTextUiX.addEventListener(prop.ReflectionEvet.CHANGE_DATA, this.inputTextUiXchange, this);
            this.colorPickUI.addEventListener(prop.ReflectionEvet.CHANGE_DATA, this.colorPickUIchange, this);
            this.height = 50;
        };
        Vec3ColorCtrlUI.prototype.destory = function () {
            this.textLabelUI.destory();
            this.inputTextUiX.destory();
            this.inputTextUiY.destory();
            this.inputTextUiZ.destory();
            this.textX.destory();
            this.textY.destory();
            this.textZ.destory();
            this.colorPickUI.destory();
        };
        Object.defineProperty(Vec3ColorCtrlUI.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this._v3d = this._data;
            },
            enumerable: true,
            configurable: true
        });
        Vec3ColorCtrlUI.prototype.inputTextUiXchange = function ($evt) {
            this.target[this.FunKey] = this._v3d;
            this.refreshViewValue();
        };
        Vec3ColorCtrlUI.prototype.colorPickUIchange = function ($evt) {
            var $vec = ($evt.data);
            this.target[this.FunKey] = $vec;
            this.refreshViewValue();
        };
        Vec3ColorCtrlUI.prototype.refreshViewValue = function () {
            this._v3d = this.target[this.FunKey];
            this.colorPickUI.vec3d = this._v3d;
            this.inputTextUiX.text = this.getNumStr(this._v3d.x);
            this.inputTextUiY.text = this.getNumStr(this._v3d.y);
            this.inputTextUiZ.text = this.getNumStr(this._v3d.z);
        };
        Vec3ColorCtrlUI.prototype.getNumStr = function (num) {
            var n = Math.floor(num * 100) / 100;
            return n.toString();
        };
        Object.defineProperty(Vec3ColorCtrlUI.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x - 15;
                this.textX.x = this._x + 55;
                this.textY.x = this._x + 125;
                this.textZ.x = this._x + 195;
                this.inputTextUiX.x = this._x + 85;
                this.inputTextUiY.x = this._x + 155;
                this.inputTextUiZ.x = this._x + 225;
                this.colorPickUI.x = this._x + 50;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3ColorCtrlUI.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y;
                this.textX.y = this._y;
                this.textY.y = this._y;
                this.textZ.y = this._y;
                this.inputTextUiX.y = this._y;
                this.inputTextUiY.y = this._y;
                this.inputTextUiZ.y = this._y;
                this.colorPickUI.y = this._y + 25;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3ColorCtrlUI.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._label = value;
                this.textLabelUI.label = value;
            },
            enumerable: true,
            configurable: true
        });
        return Vec3ColorCtrlUI;
    })(prop.BaseReflComponent);
    prop.Vec3ColorCtrlUI = Vec3ColorCtrlUI;
})(prop || (prop = {}));
//# sourceMappingURL=Vec3ColorCtrlUI.js.map