var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeVec2 = (function (_super) {
        __extends(NodeTreeVec2, _super);
        function NodeTreeVec2() {
            _super.call(this);
            this.constValue = new Vector2D;
            this.canDynamic = true;
        }
        return NodeTreeVec2;
    })(materialui.NodeTree);
    materialui.NodeTreeVec2 = NodeTreeVec2;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeVec2.js.map