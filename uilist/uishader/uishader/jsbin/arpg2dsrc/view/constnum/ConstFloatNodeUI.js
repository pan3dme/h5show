var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ConstFloatNodeUI = (function (_super) {
        __extends(ConstFloatNodeUI, _super);
        function ConstFloatNodeUI() {
            _super.call(this);
            this.gap = 20;
            this.width = 162;
            this.height = 65;
            this._constValue = 0;
            this.nodeTree = new materialui.NodeTreeFloat;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.FLOAT;
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);
            this.drawTitleToFrame("float");
        }
        return ConstFloatNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ConstFloatNodeUI = ConstFloatNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstFloatNodeUI.js.map