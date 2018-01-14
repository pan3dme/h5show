var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var FresnelNodeUI = (function (_super) {
        __extends(FresnelNodeUI, _super);
        function FresnelNodeUI() {
            _super.call(this);
            this.gap = 20;
            this.width = 162;
            this.height = 65;
            this.nodeTree = new materialui.NodeTreeFresnel;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.FRESNEL;
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);
            this.inAItem = new materialui.ItemMaterialUI("scale", materialui.MaterialItemType.FLOAT, true);
            this.addItems(this.inAItem);
            this.inBItem = new materialui.ItemMaterialUI("add", materialui.MaterialItemType.FLOAT, true);
            this.addItems(this.inBItem);
            this.drawTitleToFrame("Fresnel");
        }
        return FresnelNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.FresnelNodeUI = FresnelNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=FresnelNodeUI.js.map