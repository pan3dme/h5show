var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathSubNodeUI = (function (_super) {
        __extends(MathSubNodeUI, _super);
        function MathSubNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree = new materialui.NodeTreeSub;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.SUB;
            this.initItem();
            this.drawTitleToFrame("减法(Sub-)");
        }
        return MathSubNodeUI;
    })(materialui.MathDynamicNodeUI);
    materialui.MathSubNodeUI = MathSubNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathSubNodeUI.js.map