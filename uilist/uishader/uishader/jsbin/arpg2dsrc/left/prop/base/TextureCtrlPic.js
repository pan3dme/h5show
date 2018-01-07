var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var TextureCtrlPic = (function (_super) {
        __extends(TextureCtrlPic, _super);
        function TextureCtrlPic() {
            _super.apply(this, arguments);
        }
        TextureCtrlPic.prototype.initView = function () {
            this.textLabelUI = new prop.TextLabelUI();
            this.height = 100;
        };
        TextureCtrlPic.prototype.destory = function () {
            this.textLabelUI.destory();
        };
        Object.defineProperty(TextureCtrlPic.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        TextureCtrlPic.prototype.refreshViewValue = function () {
        };
        Object.defineProperty(TextureCtrlPic.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x + 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureCtrlPic.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureCtrlPic.prototype, "label", {
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
        return TextureCtrlPic;
    })(prop.BaseReflComponent);
    prop.TextureCtrlPic = TextureCtrlPic;
})(prop || (prop = {}));
//# sourceMappingURL=TextureCtrlPic.js.map