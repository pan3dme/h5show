var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathSinNodeUI = (function (_super) {
        __extends(MathSinNodeUI, _super);
        function MathSinNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree = new materialui.NodeTreeSin;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.SIN;
            this.initItem();
            this.drawTitleToFrame("正弦(sin)");
        }
        return MathSinNodeUI;
    })(materialui.MathStaticNodeUI);
    materialui.MathSinNodeUI = MathSinNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathSinNodeUI.js.map