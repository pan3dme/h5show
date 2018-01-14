var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeFresnel = (function (_super) {
        __extends(NodeTreeFresnel, _super);
        function NodeTreeFresnel() {
            _super.call(this);
        }
        NodeTreeFresnel.prototype.getComponentID = function ($id) {
            if ($id == 0) {
                var str = materialui.CompileOne.FT + this.regResultTemp.id + ".x";
                return str;
            }
            return null;
        };
        return NodeTreeFresnel;
    })(materialui.NodeTree);
    materialui.NodeTreeFresnel = NodeTreeFresnel;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeFresnel.js.map