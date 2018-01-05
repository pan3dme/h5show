var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathMulNodeUI = (function (_super) {
        __extends(MathMulNodeUI, _super);
        function MathMulNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree = new materialui.NodeTreeMul;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.MUL;
            this.initItem();
            this.drawTitleToFrame("乘法(Mul*)");
        }
        return MathMulNodeUI;
    })(materialui.MathDynamicNodeUI);
    materialui.MathMulNodeUI = MathMulNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathMulNodeUI.js.map