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
    var TextureSampleNodeUI = /** @class */ (function (_super) {
        __extends(TextureSampleNodeUI, _super);
        function TextureSampleNodeUI() {
            var _this = _super.call(this) || this;
            _this.name = "TextureSampleNodeUI" + random(9999999);
            _this.left = 400;
            _this.top = 100;
            _this.nodeTree = new materialui.NodeTreeTex;
            _this.nodeTree.ui = _this;
            _this.nodeTree.type = materialui.NodeTree.TEX;
            _this.width = 162;
            _this.height = 140;
            _this.initItem();
            _this.resetBgSize();
            return _this;
        }
        TextureSampleNodeUI.prototype.initItem = function () {
            this.uvItem = new materialui.ItemMaterialUI("UV", materialui.MaterialItemType.VEC2);
            this.rgbItem = new materialui.ItemMaterialUI("rgb", materialui.MaterialItemType.VEC3, false);
            this.rItem = new materialui.ItemMaterialUI("r", materialui.MaterialItemType.FLOAT, false);
            this.gItem = new materialui.ItemMaterialUI("g", materialui.MaterialItemType.FLOAT, false);
            this.bItem = new materialui.ItemMaterialUI("b", materialui.MaterialItemType.FLOAT, false);
            this.aItem = new materialui.ItemMaterialUI("a", materialui.MaterialItemType.FLOAT, false);
            this.rgbaItem = new materialui.ItemMaterialUI("rgba", materialui.MaterialItemType.VEC4, false);
            this.addItems(this.uvItem);
            this.addItems(this.rgbItem);
            this.addItems(this.rItem);
            this.addItems(this.gItem);
            this.addItems(this.bItem);
            this.addItems(this.aItem);
            this.addItems(this.rgbaItem);
        };
        return TextureSampleNodeUI;
    }(materialui.BaseMaterialNodeUI));
    materialui.TextureSampleNodeUI = TextureSampleNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=TextureSampleNodeUI.js.map