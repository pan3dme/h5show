var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var prop;
(function (prop) {
    var Texturue2DUI = /** @class */ (function (_super) {
        __extends(Texturue2DUI, _super);
        function Texturue2DUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Texturue2DUI.prototype.initView = function () {
            this.textLabelUI = new prop.TextLabelUI();
            this.textureUrlText = new prop.TextLabelUI();
            this.texturePicUi = new prop.TexturePicUi();
            this.texturePicUi.addEventListener(prop.ReflectionEvet.CHANGE_DATA, this.onChangePicurl, this);
            this.height = 100;
        };
        Texturue2DUI.prototype.onChangePicurl = function ($evt) {
            this.makeNewTextureByFile($evt.data);
        };
        Texturue2DUI.prototype.makeNewTextureByFile = function (simpleFile) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsDataURL(simpleFile);
            reader.onload = function () {
                var img = new Image();
                img.onload = function () {
                    TextureManager.getInstance().addImgRes(Scene_data.fileRoot + simpleFile.name, img);
                    _this.target[_this.FunKey] = simpleFile.name;
                    _this.refreshViewValue();
                };
                img.src = reader.result;
            };
        };
        Texturue2DUI.prototype.destory = function () {
            this.textLabelUI.destory();
            this.textureUrlText.destory();
            this.texturePicUi.destory();
        };
        Object.defineProperty(Texturue2DUI.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Texturue2DUI.prototype.refreshViewValue = function () {
            var $url = String(this.target[this.FunKey]);
            this.texturePicUi.url = $url;
            var $arr = $url.split("/");
            this.textureUrlText.label = $arr[$arr.length - 1];
        };
        Object.defineProperty(Texturue2DUI.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x + 0;
                this.texturePicUi.x = this._x + 40;
                this.textureUrlText.x = this._x + 40;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texturue2DUI.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y;
                this.texturePicUi.y = this._y;
                this.textureUrlText.y = this._y + 75;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texturue2DUI.prototype, "label", {
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
        return Texturue2DUI;
    }(prop.BaseReflComponent));
    prop.Texturue2DUI = Texturue2DUI;
})(prop || (prop = {}));
//# sourceMappingURL=Texturue2DUI.js.map