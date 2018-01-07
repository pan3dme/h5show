var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var left;
(function (left) {
    var TextCtrlInput = (function (_super) {
        __extends(TextCtrlInput, _super);
        function TextCtrlInput() {
            _super.apply(this, arguments);
            this.textLabeNum = 0;
        }
        TextCtrlInput.prototype.initView = function () {
            this.textLabelUI = new left.TextLabelUI();
            this.inputTextUi = new left.InputTextUi();
            this.inputTextUi.addEventListener(left.ReflectionEvet.CHANGE_DATA, this.onChangeInput, this);
            this.height = 20;
        };
        Object.defineProperty(TextCtrlInput.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.textLabeNum = Number(this._data);
            },
            enumerable: true,
            configurable: true
        });
        TextCtrlInput.prototype.onChangeInput = function ($evt) {
            this.textLabeNum += Number($evt.data);
            this.refreshViewValue();
            if (this.data) {
            }
        };
        TextCtrlInput.prototype.refreshViewValue = function () {
            this.inputTextUi.text = String(this.textLabeNum);
        };
        Object.defineProperty(TextCtrlInput.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.textLabelUI.x = this._x + 0;
                this.inputTextUi.x = this._x + 75;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextCtrlInput.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.textLabelUI.y = this._y;
                this.inputTextUi.y = this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextCtrlInput.prototype, "label", {
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
        return TextCtrlInput;
    })(left.BaseReflComponent);
    left.TextCtrlInput = TextCtrlInput;
})(left || (left = {}));
//# sourceMappingURL=TextCtrlInput.js.map