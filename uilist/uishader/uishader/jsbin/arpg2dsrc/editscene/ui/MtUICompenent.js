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
    var MtUICompenent = /** @class */ (function (_super) {
        __extends(MtUICompenent, _super);
        function MtUICompenent() {
            return _super.call(this) || this;
        }
        MtUICompenent.prototype.applyAbsolutePoint = function () {
            if (this.parent) {
                //this.absoluteX = this._x * MtlUiData.Scale + this.parent.x;
                //this.absoluteY = this._y * MtlUiData.Scale + this.parent.y;
                if (this._xType == -1) {
                    this.absoluteX = this._x * materialui.MtlUiData.Scale * this.scale + this.parent.x;
                }
                else if (this._xType == 0) {
                    this.absoluteX = this._left * materialui.MtlUiData.Scale;
                }
                else if (this._xType == 1) {
                    this.absoluteX = Scene_data.stageWidth - this._right * materialui.MtlUiData.Scale - this.width * materialui.MtlUiData.Scale;
                }
                else if (this._xType == 2) {
                    this.absoluteX = this._center * materialui.MtlUiData.Scale + Scene_data.stageWidth / 2 - this.width * materialui.MtlUiData.Scale / 2;
                }
                if (this._yType == -1) {
                    this.absoluteY = this._y * materialui.MtlUiData.Scale * this.scale + this.parent.y;
                }
                else if (this._yType == 0) {
                    this.absoluteY = this._top * materialui.MtlUiData.Scale;
                }
                else if (this._yType == 1) {
                    this.absoluteY = Scene_data.stageHeight - this._bottom * materialui.MtlUiData.Scale - this.height * materialui.MtlUiData.Scale;
                }
                else if (this._yType == 2) {
                    this.absoluteY = this._middle * materialui.MtlUiData.Scale + Scene_data.stageHeight / 2 - this.height * materialui.MtlUiData.Scale / 2;
                }
                this.absoluteWidth = this.width * materialui.MtlUiData.Scale;
                this.absoluteHeight = this.height * materialui.MtlUiData.Scale;
                this.applyRenderSize();
            }
        };
        return MtUICompenent;
    }(UICompenent));
    materialui.MtUICompenent = MtUICompenent;
})(materialui || (materialui = {}));
//# sourceMappingURL=MtUICompenent.js.map