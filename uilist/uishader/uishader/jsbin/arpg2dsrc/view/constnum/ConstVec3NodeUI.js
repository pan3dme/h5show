var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ConstVec3NodeUI = (function (_super) {
        __extends(ConstVec3NodeUI, _super);
        function ConstVec3NodeUI() {
            _super.call(this);
            this._bastTitleStr = "vec3";
            this.gap = 20;
            this.width = 162;
            this.height = 95;
            this._constValue = new Vector3D;
            this.initNodeTree();
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.VEC3, false);
            this.addItems(this.outItem);
            this.outAItem = new materialui.ItemMaterialUI("alpha", materialui.MaterialItemType.FLOAT, false);
            this.addItems(this.outAItem);
            this.outRGBAItem = new materialui.ItemMaterialUI("rgba", materialui.MaterialItemType.VEC4, false);
            this.addItems(this.outRGBAItem);
            this.drawTitleToFrame("vec3");
        }
        ConstVec3NodeUI.prototype.initNodeTree = function () {
            this.nodeTree = new materialui.NodeTreeVec3;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.VEC3;
        };
        return ConstVec3NodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ConstVec3NodeUI = ConstVec3NodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstVec3NodeUI.js.map