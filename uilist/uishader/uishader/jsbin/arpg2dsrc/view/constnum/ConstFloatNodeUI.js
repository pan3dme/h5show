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
    var ConstFloatNodeUI = /** @class */ (function (_super) {
        __extends(ConstFloatNodeUI, _super);
        function ConstFloatNodeUI() {
            var _this = _super.call(this) || this;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 65;
            _this._constValue = 0;
            _this.nodeTree = new materialui.NodeTreeFloat;
            _this.nodeTree.ui = _this;
            _this.nodeTree.type = materialui.NodeTree.FLOAT;
            _this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            _this.addItems(_this.outItem);
            _this.drawTitleToFrame("float");
            return _this;
        }
        return ConstFloatNodeUI;
    }(materialui.BaseMaterialNodeUI));
    materialui.ConstFloatNodeUI = ConstFloatNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstFloatNodeUI.js.map