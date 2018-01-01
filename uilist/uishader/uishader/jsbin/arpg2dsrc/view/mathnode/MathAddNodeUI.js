var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MathAddNodeUI = (function (_super) {
        __extends(MathAddNodeUI, _super);
        function MathAddNodeUI() {
            _super.call(this);
            this.left = 600;
            this.top = 300;
            this.nodeTree = new materialui.NodeTreeAdd;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.ADD;
            this.initItem();
        }
        return MathAddNodeUI;
    })(materialui.MathDynamicNodeUI);
    materialui.MathAddNodeUI = MathAddNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MathAddNodeUI.js.map