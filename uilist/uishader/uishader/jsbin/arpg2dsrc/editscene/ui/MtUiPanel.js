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
var materialui;
(function (materialui) {
    var MtlUiData = /** @class */ (function () {
        function MtlUiData() {
        }
        MtlUiData.Scale = 1;
        return MtlUiData;
    }());
    materialui.MtlUiData = MtlUiData;
    var MtUiPanel = /** @class */ (function (_super) {
        __extends(MtUiPanel, _super);
        function MtUiPanel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(MtUiPanel.prototype, "left", {
            get: function () {
                return this._left;
            },
            set: function (value) {
                this._left = value;
                this._xType = 0;
                this._x = this._left * MtlUiData.Scale;
                this.applyChild();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MtUiPanel.prototype, "top", {
            get: function () {
                return this._top;
            },
            set: function (value) {
                this._top = value;
                this._yType = 0;
                this._y = this._top * MtlUiData.Scale;
                this.applyChild();
            },
            enumerable: true,
            configurable: true
        });
        MtUiPanel.prototype.resize = function () {
            if (this._xType == 0) {
                this._x = this._left * MtlUiData.Scale;
            }
            else if (this._xType == 1) {
                this._x = Scene_data.stageWidth - this._right * MtlUiData.Scale - this.width * MtlUiData.Scale;
            }
            else if (this._xType == 2) {
                this._x = this._center * MtlUiData.Scale + Scene_data.stageWidth / 2 - this.width * MtlUiData.Scale / 2;
            }
            if (this._yType == 0) {
                this._y = this._top * MtlUiData.Scale;
            }
            else if (this._yType == 1) {
                this._y = Scene_data.stageHeight - this._bottom * MtlUiData.Scale - this.height * MtlUiData.Scale;
            }
            else if (this._yType == 2) {
                this._y = this._middle * MtlUiData.Scale + Scene_data.stageHeight / 2 - this.height * MtlUiData.Scale / 2;
            }
            this.applyChild();
            this.resizeVirtualList();
        };
        return MtUiPanel;
    }(UIPanel));
    materialui.MtUiPanel = MtUiPanel;
})(materialui || (materialui = {}));
//# sourceMappingURL=MtUiPanel.js.map