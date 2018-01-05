var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathDivNodeUI = (function (_super) {
        __extends(MathDivNodeUI, _super);
        function MathDivNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree = new materialui.NodeTreeDiv;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.DIV;
            this.initItem();
            this.drawTitleToFrame("除法(Div/)");
        }
        return MathDivNodeUI;
    })(materialui.MathDynamicNodeUI);
    materialui.MathDivNodeUI = MathDivNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathDivNodeUI.js.map