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
    var ConstVec2NodeUI = /** @class */ (function (_super) {
        __extends(ConstVec2NodeUI, _super);
        function ConstVec2NodeUI() {
            var _this = _super.call(this) || this;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 95;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 65;
            _this._constValue = new Vector2D;
            _this.nodeTree = new materialui.NodeTreeVec2;
            _this.nodeTree.ui = _this;
            _this.nodeTree.type = materialui.NodeTree.VEC2;
            _this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.VEC2, false);
            _this.addItems(_this.outItem);
            _this.drawTitleToFrame("vec2");
            return _this;
        }
        return ConstVec2NodeUI;
    }(materialui.BaseMaterialNodeUI));
    materialui.ConstVec2NodeUI = ConstVec2NodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstVec2NodeUI.js.map