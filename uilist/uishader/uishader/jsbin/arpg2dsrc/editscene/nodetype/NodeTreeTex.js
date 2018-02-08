var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeTex = (function (_super) {
        __extends(NodeTreeTex, _super);
        function NodeTreeTex() {
            _super.call(this);
        }
        NodeTreeTex.prototype.checkInput = function () {
            return true;
        };
        return NodeTreeTex;
    })(materialui.NodeTree);
    materialui.NodeTreeTex = NodeTreeTex;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeTex.js.map