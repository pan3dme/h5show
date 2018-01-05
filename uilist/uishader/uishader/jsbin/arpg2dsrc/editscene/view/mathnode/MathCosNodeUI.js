var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathCosNodeUI = (function (_super) {
        __extends(MathCosNodeUI, _super);
        function MathCosNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.COS;
            this.initItem();
            this.drawTitleToFrame("正弦(sin)");
        }
        return MathCosNodeUI;
    })(materialui.MathStaticNodeUI);
    materialui.MathCosNodeUI = MathCosNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathCosNodeUI.js.map