var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeOP = (function (_super) {
        __extends(NodeTreeOP, _super);
        function NodeTreeOP() {
            _super.call(this);
            this.writeZbuffer = true;
            this.isUseLightMap = true;
        }
        NodeTreeOP.prototype.checkInput = function () {
            return true;
        };
        return NodeTreeOP;
    })(materialui.NodeTree);
    materialui.NodeTreeOP = NodeTreeOP;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeOP.js.map