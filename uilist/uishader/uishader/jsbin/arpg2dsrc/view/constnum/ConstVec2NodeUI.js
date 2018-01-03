var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ConstVec2NodeUI = (function (_super) {
        __extends(ConstVec2NodeUI, _super);
        function ConstVec2NodeUI() {
            _super.call(this);
            this.gap = 20;
            this.width = 162;
            this.height = 95;
            this.gap = 20;
            this.width = 162;
            this.height = 65;
            this._constValue = new Vector2D;
            this.nodeTree = new materialui.NodeTreeVec2;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.VEC2;
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.VEC2, false);
            this.addItems(this.outItem);
            this.drawTitleToFrame("vec2");
        }
        return ConstVec2NodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ConstVec2NodeUI = ConstVec2NodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstVec2NodeUI.js.map