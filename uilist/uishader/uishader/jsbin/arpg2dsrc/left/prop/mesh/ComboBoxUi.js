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
    var ComboBoxUi = /** @class */ (function (_super) {
        __extends(ComboBoxUi, _super);
        function ComboBoxUi() {
            return _super.call(this) || this;
        }
        ComboBoxUi.prototype.initView = function () {
            this.textLabelUIMeshVo.name = "是否";
            this.addEvets();
        };
        ComboBoxUi.prototype.addEvets = function () {
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
        };
        ComboBoxUi.prototype.destory = function () {
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.removeEventListener(InteractiveEvent.Down, this.butClik, this);
            _super.prototype.destory.call(this);
        };
        Object.defineProperty(ComboBoxUi.prototype, "text", {
            set: function (value) {
                this.textLabelUIMeshVo.name = value;
            },
            enumerable: true,
            configurable: true
        });
        ComboBoxUi.prototype.butClik = function (evt) {
            this.dispatchEvent(evt);
        };
        return ComboBoxUi;
    }(prop.TextLabelUI));
    prop.ComboBoxUi = ComboBoxUi;
})(prop || (prop = {}));
//# sourceMappingURL=ComboBoxUi.js.map