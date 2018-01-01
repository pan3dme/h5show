var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ResultNodeUI = (function (_super) {
        __extends(ResultNodeUI, _super);
        function ResultNodeUI() {
            _super.call(this);
            this.left = 900;
            this.top = 300;
            this.gap = 30;
            this.width = 162;
            this.height = 310;
            this.nodeTree = new materialui.NodeTreeOP;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.OP;
            this.initItem();
            var $a_resultNodeUItxt = this.addChild(this._midRender.getComponent("a_resultNodeUItxt"));
            $a_resultNodeUItxt.x = 30;
            this.resetBgSize();
        }
        ResultNodeUI.prototype.initItem = function () {
            this.diffuseItem = new materialui.ItemMaterialUI("漫反射(Diffuse)", materialui.MaterialItemType.VEC3);
            this.metallicItem = new materialui.ItemMaterialUI("金属(metallic)", materialui.MaterialItemType.FLOAT);
            this.specularItem = new materialui.ItemMaterialUI("高光(Specular)", materialui.MaterialItemType.FLOAT);
            this.specularPowerItem = new materialui.ItemMaterialUI("粗糙度(Roughness)", materialui.MaterialItemType.FLOAT);
            this.normalItem = new materialui.ItemMaterialUI("法线(Normal)", materialui.MaterialItemType.VEC3);
            this.reflectItem = new materialui.ItemMaterialUI("反射(Reflection)", materialui.MaterialItemType.VEC3);
            this.subsurfaceColorItem = new materialui.ItemMaterialUI("表面散射(subsurface)", materialui.MaterialItemType.VEC3);
            this.alphaItem = new materialui.ItemMaterialUI("透明度(alpha)", materialui.MaterialItemType.FLOAT);
            this.killItem = new materialui.ItemMaterialUI("不透明蒙版(alphaMask)", materialui.MaterialItemType.FLOAT);
            this.emissiveItem = new materialui.ItemMaterialUI("自发光(emissive)", materialui.MaterialItemType.VEC3);
            this.addItems(this.diffuseItem);
            this.addItems(this.metallicItem);
            this.addItems(this.specularItem);
            this.addItems(this.specularPowerItem);
            this.addItems(this.normalItem);
            this.addItems(this.reflectItem);
            this.addItems(this.subsurfaceColorItem);
            this.addItems(this.alphaItem);
            this.addItems(this.killItem);
            this.addItems(this.emissiveItem);
        };
        return ResultNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ResultNodeUI = ResultNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ResultNodeUI.js.map