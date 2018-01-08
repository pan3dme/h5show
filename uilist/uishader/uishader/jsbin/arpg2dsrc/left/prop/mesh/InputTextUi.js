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
    var InputTextUi = /** @class */ (function (_super) {
        __extends(InputTextUi, _super);
        function InputTextUi() {
            return _super.call(this) || this;
        }
        InputTextUi.prototype.initView = function () {
            this.textLabelUIMeshVo.name = "3.599";
            this.addEvets();
        };
        InputTextUi.prototype.addEvets = function () {
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
        };
        InputTextUi.prototype.destory = function () {
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.removeEventListener(InteractiveEvent.Down, this.butClik, this);
            _super.prototype.destory.call(this);
        };
        Object.defineProperty(InputTextUi.prototype, "text", {
            set: function (value) {
                this.textLabelUIMeshVo.name = value;
                // console.log("valuevaluevalue", value)
            },
            enumerable: true,
            configurable: true
        });
        InputTextUi.prototype.butClik = function (evt) {
            this.addStageMoveEvets(evt);
        };
        InputTextUi.prototype.addStageMoveEvets = function ($e) {
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        InputTextUi.prototype.onMove = function ($e) {
            var $reflectionEvet = new prop.ReflectionEvet(prop.ReflectionEvet.CHANGE_DATA);
            $reflectionEvet.data = $e.x - this.mouseXY.x;
            this.dispatchEvent($reflectionEvet);
            this.mouseXY = new Vector2D($e.x, $e.y);
        };
        InputTextUi.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        return InputTextUi;
    }(prop.TextLabelUI));
    prop.InputTextUi = InputTextUi;
})(prop || (prop = {}));
//# sourceMappingURL=InputTextUi.js.map