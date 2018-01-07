var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathStaticNodeUI = (function (_super) {
        __extends(MathStaticNodeUI, _super);
        function MathStaticNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.gap = 20;
            this.width = 162;
            this.height = 80;
            this.resetBgSize();
        }
        MathStaticNodeUI.prototype.initItem = function () {
            this.intItem = new materialui.ItemMaterialUI("in", materialui.MaterialItemType.FLOAT);
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            this.addItems(this.intItem);
            this.addItems(this.outItem);
        };
        return MathStaticNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.MathStaticNodeUI = MathStaticNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathStaticNodeUI.js.map